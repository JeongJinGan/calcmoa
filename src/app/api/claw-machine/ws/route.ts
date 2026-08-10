import { randomUUID } from "crypto";
import { experimental_upgradeWebSocket } from "@vercel/functions";
import Redis from "ioredis";
import type { WebSocket } from "ws";
import { AVATARS, GAME_PALETTE } from "@/lib/games/ladder";
import {
  GRAB_COOLDOWN_MS,
  GRIP_SUCCESS_RATE,
  MAX_PLAYERS,
  PRIZE_RATIO,
  RESPAWN_MS,
  ROOM_TTL_SECONDS,
  SLOT_COUNT,
  assignPrizeSlots,
  resolveSlotIndex,
  type PlayerState,
  type SlotState,
} from "@/lib/games/clawMachine";

export const runtime = "nodejs";
export const maxDuration = 300;

const metaKey = (roomId: string) => `claw:${roomId}:meta`;
const playersKey = (roomId: string) => `claw:${roomId}:players`;
const slotsKey = (roomId: string) => `claw:${roomId}:slots`;
const channelKey = (roomId: string) => `claw:${roomId}:events`;
const winnerKey = (roomId: string) => `claw:${roomId}:winner`;

interface Winner {
  playerId: string;
  nickname: string;
}

// Atomically resolves a grab against one capsule slot: reveals it (or lazily respawns
// it with a fresh independent roll if enough time has passed since it was last revealed)
// and reports whether it held a prize. Runs server-side via EVAL so concurrent grabs
// across different function instances can never race on the same slots key.
//
// A grab against an available capsule isn't guaranteed to hold — a weak-grip roll can
// fail to lift it at all, in which case the slot is left completely untouched (still
// hidden, still there to try again) rather than being consumed.
const GRAB_SCRIPT = `
local slotsJson = redis.call('GET', KEYS[1])
if not slotsJson then
  return false
end
local slots = cjson.decode(slotsJson)
local idx = tonumber(ARGV[1]) + 1
local now = tonumber(ARGV[2])
local respawnMs = tonumber(ARGV[3])
local ratio = tonumber(ARGV[4])
local ttl = tonumber(ARGV[5])
local gripRate = tonumber(ARGV[6])

local slot = slots[idx]
local available = false
if slot.state == 'hidden' then
  available = true
elseif slot.revealedAt and (now - slot.revealedAt) > respawnMs then
  available = true
  slot.prize = (math.random() < ratio)
end

if not available then
  return cjson.encode({ gripped = false, alreadyEmpty = true, prize = false, slots = slots })
end

if math.random() >= gripRate then
  -- Failed to lift it — nothing about the slot changes, so it's still there to try again.
  return cjson.encode({ gripped = false, alreadyEmpty = false, prize = false, slots = slots })
end

local prize = slot.prize
slot.state = 'revealed'
slot.revealedAt = now
slots[idx] = slot

redis.call('SET', KEYS[1], cjson.encode(slots))
redis.call('EXPIRE', KEYS[1], ttl)

return cjson.encode({ gripped = true, alreadyEmpty = false, prize = prize, slots = slots })
`;

type RedisWithGrab = Redis & {
  grabSlot(key: string, ...args: (string | number)[]): Promise<string | null>;
};

let publisher: RedisWithGrab | null = null;

function getRedisUrl(): string {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  return url;
}

function getPublisher(): RedisWithGrab {
  if (!publisher) {
    const client = new Redis(getRedisUrl()) as RedisWithGrab;
    client.defineCommand("grabSlot", { numberOfKeys: 1, lua: GRAB_SCRIPT });
    publisher = client;
  }
  return publisher;
}

interface RoomFanout {
  subscriber: Redis;
  sockets: Set<WebSocket>;
}

// Purely a local cache of "which of THIS instance's sockets care about which room" —
// never treated as authoritative. It can vanish on redeploy/instance recycle and gets
// rebuilt from scratch on the next join; the real room state always lives in Redis.
const roomFanouts = new Map<string, RoomFanout>();

function getOrCreateFanout(roomId: string): RoomFanout {
  const existing = roomFanouts.get(roomId);
  if (existing) return existing;

  const subscriber = new Redis(getRedisUrl());
  const sockets = new Set<WebSocket>();
  const fanout: RoomFanout = { subscriber, sockets };
  roomFanouts.set(roomId, fanout);

  subscriber.subscribe(channelKey(roomId)).catch(() => {});
  subscriber.on("message", (_channel, message) => {
    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) socket.send(message);
    }
  });

  return fanout;
}

function releaseFanout(roomId: string, socket: WebSocket) {
  const fanout = roomFanouts.get(roomId);
  if (!fanout) return;
  fanout.sockets.delete(socket);
  if (fanout.sockets.size === 0) {
    fanout.subscriber.unsubscribe().catch(() => {});
    fanout.subscriber.quit().catch(() => {});
    roomFanouts.delete(roomId);
  }
}

async function publishEvent(roomId: string, event: Record<string, unknown>) {
  await getPublisher().publish(channelKey(roomId), JSON.stringify(event));
}

async function refreshRoomTtl(roomId: string) {
  const redis = getPublisher();
  const pipeline = redis.pipeline();
  pipeline.expire(metaKey(roomId), ROOM_TTL_SECONDS);
  pipeline.expire(playersKey(roomId), ROOM_TTL_SECONDS);
  pipeline.expire(slotsKey(roomId), ROOM_TTL_SECONDS);
  await pipeline.exec();
}

async function ensureRoomInitialized(roomId: string) {
  const redis = getPublisher();
  const initialSlots = JSON.stringify(assignPrizeSlots(SLOT_COUNT, PRIZE_RATIO));
  await redis.set(slotsKey(roomId), initialSlots, "EX", ROOM_TTL_SECONDS, "NX");
  await redis
    .multi()
    .hset(metaKey(roomId), { createdAt: Date.now(), slotCount: SLOT_COUNT, prizeRatio: PRIZE_RATIO })
    .expire(metaKey(roomId), ROOM_TTL_SECONDS)
    .exec();
}

function sanitizeNickname(raw: unknown): string {
  const text = typeof raw === "string" ? raw.trim().slice(0, 12) : "";
  return text || "플레이어";
}

function sanitizeClientId(raw: unknown): string {
  return typeof raw === "string" && raw.length > 0 && raw.length <= 40 ? raw : randomUUID();
}

function clamp01(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.min(1, Math.max(0, n));
}

function send(ws: WebSocket, event: Record<string, unknown>) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(event));
}

export async function GET(req: Request) {
  const roomId = new URL(req.url).searchParams.get("room");
  if (!roomId) return new Response("Missing room", { status: 400 });

  return experimental_upgradeWebSocket((ws) => {
    let playerId: string | null = null;

    ws.on("message", async (raw) => {
      let message: Record<string, unknown>;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        return;
      }

      try {
        if (message.type === "join" && !playerId) {
          const redis = getPublisher();
          const id = sanitizeClientId(message.clientId);

          // Rejoining with a clientId we already have (reconnect after a dropped
          // connection, function recycling, etc.) upserts the existing player
          // instead of minting a new one — otherwise every reconnect would leave
          // a ghost duplicate of the same person behind.
          const existingRaw = await redis.hget(playersKey(roomId), id);

          if (!existingRaw) {
            const playerCount = await redis.hlen(playersKey(roomId));
            if (playerCount >= MAX_PLAYERS) {
              send(ws, { type: "room_full" });
              ws.close();
              return;
            }
          }

          await ensureRoomInitialized(roomId);

          let player: PlayerState;
          if (existingRaw) {
            player = JSON.parse(existingRaw) as PlayerState;
            player.nickname = sanitizeNickname(message.nickname);
          } else {
            const index = await redis.hlen(playersKey(roomId));
            player = {
              nickname: sanitizeNickname(message.nickname),
              avatar: AVATARS[index % AVATARS.length],
              color: GAME_PALETTE[index % GAME_PALETTE.length],
              x: (index + 0.5) / MAX_PLAYERS,
              y: 0,
              lastGrabAt: 0,
            };
          }

          await redis.hset(playersKey(roomId), id, JSON.stringify(player));
          await refreshRoomTtl(roomId);

          playerId = id;
          const fanout = getOrCreateFanout(roomId);
          fanout.sockets.add(ws);

          const [playersRaw, slotsRaw, winnerRaw] = await Promise.all([
            redis.hgetall(playersKey(roomId)),
            redis.get(slotsKey(roomId)),
            redis.get(winnerKey(roomId)),
          ]);
          const players = Object.entries(playersRaw).map(([pid, json]) => ({
            playerId: pid,
            ...(JSON.parse(json) as PlayerState),
          }));
          const slots: SlotState[] = slotsRaw ? JSON.parse(slotsRaw) : [];
          const winner: Winner | null = winnerRaw ? JSON.parse(winnerRaw) : null;

          send(ws, { type: "joined", playerId: id, self: player, players, slots, winner });
          await publishEvent(roomId, { type: "player_joined", player: { playerId: id, ...player } });
          return;
        }

        if (!playerId) return; // ignore anything before a successful join

        if (message.type === "move") {
          const redis = getPublisher();
          const raw = await redis.hget(playersKey(roomId), playerId);
          if (!raw) return;
          const player = JSON.parse(raw) as PlayerState;
          player.x = clamp01(message.x);
          player.y = clamp01(message.y);
          await redis.hset(playersKey(roomId), playerId, JSON.stringify(player));
          await refreshRoomTtl(roomId);
          await publishEvent(roomId, { type: "player_moved", playerId, x: player.x, y: player.y });
          return;
        }

        if (message.type === "grab") {
          const redis = getPublisher();

          const alreadyWon = await redis.get(winnerKey(roomId));
          if (alreadyWon) {
            send(ws, { type: "error", message: "이미 당첨자가 나와서 게임이 종료됐어요." });
            return;
          }

          const raw = await redis.hget(playersKey(roomId), playerId);
          if (!raw) return;
          const player = JSON.parse(raw) as PlayerState;

          const now = Date.now();
          if (now - player.lastGrabAt < GRAB_COOLDOWN_MS) {
            send(ws, { type: "error", message: "너무 빨리 뽑았어요. 잠시 후 다시 시도해주세요." });
            return;
          }

          const slotIndex = resolveSlotIndex(player.x, SLOT_COUNT);
          const resultRaw = await redis.grabSlot(
            slotsKey(roomId),
            slotIndex,
            now,
            RESPAWN_MS,
            PRIZE_RATIO,
            ROOM_TTL_SECONDS,
            GRIP_SUCCESS_RATE
          );
          if (!resultRaw) return;
          const result = JSON.parse(resultRaw) as {
            gripped: boolean;
            prize: boolean;
            alreadyEmpty: boolean;
            slots: SlotState[];
          };

          player.lastGrabAt = now;
          await redis.hset(playersKey(roomId), playerId, JSON.stringify(player));
          await refreshRoomTtl(roomId);

          await publishEvent(roomId, {
            type: "grab_result",
            playerId,
            slotIndex,
            gripped: result.gripped,
            prize: result.prize,
            alreadyEmpty: result.alreadyEmpty,
            slots: result.slots,
          });

          // First prize claimed wins the room and ends the game for everyone. SET NX
          // makes "first" well-defined even if two players' grabs land within the same
          // instant — only one SETNX can ever succeed.
          if (result.gripped && result.prize) {
            const winner: Winner = { playerId, nickname: player.nickname };
            const won = await redis.set(winnerKey(roomId), JSON.stringify(winner), "EX", ROOM_TTL_SECONDS, "NX");
            if (won === "OK") {
              await publishEvent(roomId, { type: "game_over", winner });
            }
          }
          return;
        }
      } catch {
        send(ws, { type: "error", message: "요청을 처리하지 못했어요." });
      }
    });

    ws.on("close", async () => {
      if (!playerId) return;
      releaseFanout(roomId, ws);
      try {
        await getPublisher().hdel(playersKey(roomId), playerId);
        await publishEvent(roomId, { type: "player_left", playerId });
      } catch {
        // room may already be gone (TTL expired) — nothing to clean up
      }
    });
  });
}
