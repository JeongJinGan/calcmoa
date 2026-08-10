"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import type { PlayerState, PublicPlayer, SlotState } from "@/lib/games/clawMachine";

export type ConnectionStatus = "connecting" | "open" | "closed";

export interface Winner {
  playerId: string;
  nickname: string;
}

interface JoinedEvent {
  type: "joined";
  playerId: string;
  self: PlayerState;
  players: PublicPlayer[];
  slots: SlotState[];
  winner: Winner | null;
}
interface PlayerJoinedEvent {
  type: "player_joined";
  player: PublicPlayer;
}
interface PlayerMovedEvent {
  type: "player_moved";
  playerId: string;
  x: number;
  y: number;
}
interface PlayerLeftEvent {
  type: "player_left";
  playerId: string;
}
interface GrabResultEvent {
  type: "grab_result";
  playerId: string;
  slotIndex: number;
  gripped: boolean;
  prize: boolean;
  alreadyEmpty: boolean;
  slots: SlotState[];
}
interface RoomFullEvent {
  type: "room_full";
}
interface ErrorEvent {
  type: "error";
  message: string;
}
interface GameOverEvent {
  type: "game_over";
  winner: Winner;
}

type ServerEvent =
  | JoinedEvent
  | PlayerJoinedEvent
  | PlayerMovedEvent
  | PlayerLeftEvent
  | GrabResultEvent
  | RoomFullEvent
  | ErrorEvent
  | GameOverEvent;

export interface GrabOutcome {
  playerId: string;
  slotIndex: number;
  gripped: boolean;
  prize: boolean;
  alreadyEmpty: boolean;
}

export interface ClawMachineState {
  status: ConnectionStatus;
  playerId: string | null;
  players: Record<string, PublicPlayer>;
  slots: SlotState[];
  roomFull: boolean;
  errorMessage: string | null;
  winner: Winner | null;
}

const INITIAL_STATE: ClawMachineState = {
  status: "connecting",
  playerId: null,
  players: {},
  slots: [],
  roomFull: false,
  errorMessage: null,
  winner: null,
};

const MOVE_MIN_INTERVAL_MS = 50;

export function useClawMachineSocket(
  roomId: string,
  nickname: string,
  onGrabResult?: (outcome: GrabOutcome) => void
) {
  const [state, setState] = useState<ClawMachineState>(INITIAL_STATE);
  // Stable per-tab identity: survives reconnects (dropped connection, function
  // recycling) within this mounted hook instance, so rejoining upserts the same
  // player instead of the server minting a fresh one and leaving a ghost behind.
  const [clientId] = useState(() => nanoid());
  const socketRef = useRef<WebSocket | null>(null);
  const onGrabResultRef = useRef(onGrabResult);
  useEffect(() => {
    onGrabResultRef.current = onGrabResult;
  });
  const reconnectDelayRef = useRef(1000);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedByUserRef = useRef(false);

  const pendingMoveRef = useRef<{ x: number; y: number } | null>(null);
  // setTimeout, not requestAnimationFrame: rAF callbacks are paused by the browser
  // while the tab is backgrounded/unfocused, which would silently strand a pending
  // move (button nudge or drag) until the tab regains focus. setTimeout keeps firing.
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMoveSentRef = useRef(0);

  const send = useCallback((message: Record<string, unknown>) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, []);

  const sendMove = useCallback(
    (x: number, y: number) => {
      pendingMoveRef.current = { x, y };
      if (moveTimerRef.current !== null) return;

      const flush = () => {
        moveTimerRef.current = null;
        const pending = pendingMoveRef.current;
        if (!pending) return;
        const elapsed = Date.now() - lastMoveSentRef.current;
        if (elapsed < MOVE_MIN_INTERVAL_MS) {
          moveTimerRef.current = setTimeout(flush, MOVE_MIN_INTERVAL_MS - elapsed);
          return;
        }
        lastMoveSentRef.current = Date.now();
        pendingMoveRef.current = null;
        send({ type: "move", x: pending.x, y: pending.y });
      };

      moveTimerRef.current = setTimeout(flush, 0);
    },
    [send]
  );

  const sendGrab = useCallback(() => {
    send({ type: "grab" });
  }, [send]);

  useEffect(() => {
    closedByUserRef.current = false;

    function applyEvent(data: ServerEvent) {
      if (data.type === "grab_result") {
        onGrabResultRef.current?.({
          playerId: data.playerId,
          slotIndex: data.slotIndex,
          gripped: data.gripped,
          prize: data.prize,
          alreadyEmpty: data.alreadyEmpty,
        });
      }

      setState((prev) => {
        switch (data.type) {
          case "joined": {
            const players: Record<string, PublicPlayer> = {};
            for (const p of data.players) players[p.playerId] = p;
            return {
              ...prev,
              playerId: data.playerId,
              players,
              slots: data.slots,
              roomFull: false,
              winner: data.winner,
            };
          }
          case "player_joined":
            return { ...prev, players: { ...prev.players, [data.player.playerId]: data.player } };
          case "player_moved": {
            const existing = prev.players[data.playerId];
            if (!existing) return prev;
            return {
              ...prev,
              players: { ...prev.players, [data.playerId]: { ...existing, x: data.x, y: data.y } },
            };
          }
          case "player_left": {
            const next = { ...prev.players };
            delete next[data.playerId];
            return { ...prev, players: next };
          }
          case "grab_result":
            return { ...prev, slots: data.slots };
          case "room_full":
            return { ...prev, roomFull: true };
          case "error":
            return { ...prev, errorMessage: data.message };
          case "game_over":
            return { ...prev, winner: data.winner };
          default:
            return prev;
        }
      });
    }

    function connect() {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(`${protocol}//${window.location.host}/api/claw-machine/ws?room=${roomId}`);
      socketRef.current = socket;
      setState((prev) => ({ ...prev, status: "connecting" }));

      socket.addEventListener("open", () => {
        reconnectDelayRef.current = 1000;
        setState((prev) => ({ ...prev, status: "open" }));
        socket.send(JSON.stringify({ type: "join", nickname, clientId }));
      });

      socket.addEventListener("message", (event) => {
        try {
          applyEvent(JSON.parse(event.data));
        } catch {
          // ignore malformed frames
        }
      });

      socket.addEventListener("close", () => {
        setState((prev) => ({ ...prev, status: "closed" }));
        if (closedByUserRef.current) return;
        const delay = reconnectDelayRef.current;
        reconnectDelayRef.current = Math.min(delay * 2, 30000);
        reconnectTimerRef.current = setTimeout(connect, delay);
      });

      socket.addEventListener("error", () => {
        socket.close();
      });
    }

    connect();

    return () => {
      closedByUserRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (moveTimerRef.current !== null) clearTimeout(moveTimerRef.current);
      socketRef.current?.close();
    };
  }, [roomId, nickname, clientId]);

  return { ...state, sendMove, sendGrab };
}
