"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  GRAB_COOLDOWN_MS,
  RESPAWN_MS,
  SLOT_COUNT,
  isSlotAvailable,
  pileSpot,
  slotCenterX,
} from "@/lib/games/clawMachine";
import { useClawMachineSocket, type GrabOutcome } from "@/lib/games/useClawMachineSocket";
import { CapsuleIcon, ClawIcon } from "@/components/games/ClawMachineIcons";

const NICKNAME_STORAGE_KEY = "calcmoa:claw-machine:nickname";

// Play-area geometry, in px, shared by the drag rail, the claw's vertical travel and the
// capsule pile so all three line up in one coordinate space.
const CONTAINER_HEIGHT = 268;
const CLAW_UP = 8;
const PIT_TOP = 46;
const PIT_HEIGHT = 208;
const CAPSULE_SIZE = 32;

const pileTopPx = (y: number) => PIT_TOP + y * PIT_HEIGHT;
const clawDownFor = (slotIndex: number) => pileTopPx(pileSpot(slotIndex).y) - 16;

// Holding a move button glides the claw continuously (fraction of full width per second)
// instead of jumping by a fixed step — a quick tap nudges a hair, a long hold glides across.
const HOLD_SPEED = 0.45;

// Grab animation timeline: align (pure horizontal slide to line up over the target
// capsule) -> descend (pure vertical drop) -> close on the capsule -> rise (pure
// vertical). A failed grip (the claw closes on nothing even though a capsule was
// there) never attaches a capsule at all; a miss that WAS gripped slips out partway
// through the rise; a win keeps rising past the top and shrinks away — "collected!".
const ALIGN_MS = 180;
const DESCEND_MS = 420;
const GRAB_MS = 220;
const RISE_MS = 550;
const DROP_DELAY_MS = 200;
const DROP_MS = 320;
const COLLECT_MS = 400;

type GrabPhase = "align" | "descend" | "grab" | "rise" | "drop" | "collect";

interface GrabAnim {
  slotIndex: number;
  gripped: boolean;
  prize: boolean;
  alreadyEmpty: boolean;
  phase: GrabPhase;
}

interface ClawMachineGameProps {
  roomId: string;
}

export default function ClawMachineGame({ roomId }: ClawMachineGameProps) {
  const [nickname, setNickname] = useState<string | null>(() =>
    window.sessionStorage.getItem(NICKNAME_STORAGE_KEY)
  );
  const [nicknameInput, setNicknameInput] = useState("");

  if (!nickname) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
        <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">닉네임을 입력해주세요</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = nicknameInput.trim().slice(0, 12);
            if (!trimmed) return;
            window.sessionStorage.setItem(NICKNAME_STORAGE_KEY, trimmed);
            setNickname(trimmed);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            maxLength={12}
            placeholder="예: 뽑기왕"
            autoFocus
            className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-neutral-800 dark:focus:bg-neutral-800"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            입장하기
          </button>
        </form>
      </div>
    );
  }

  return <ClawMachineRoom roomId={roomId} nickname={nickname} />;
}

function ClawMachineRoom({ roomId, nickname }: { roomId: string; nickname: string }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [localX, setLocalX] = useState(0.5);
  const localXRef = useRef(0.5);
  const [now, setNow] = useState(() => Date.now());
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [toast, setToast] = useState<GrabOutcome | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animations, setAnimations] = useState<Record<string, GrabAnim>>({});
  const animTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});
  const holdDirectionRef = useRef<1 | -1 | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdTsRef = useRef(0);

  const scheduleGrabAnimation = useCallback((grabberId: string, outcome: GrabOutcome) => {
    animTimersRef.current[grabberId]?.forEach(clearTimeout);
    const timers: ReturnType<typeof setTimeout>[] = [];

    setAnimations((prev) => ({
      ...prev,
      [grabberId]: {
        slotIndex: outcome.slotIndex,
        gripped: outcome.gripped,
        prize: outcome.prize,
        alreadyEmpty: outcome.alreadyEmpty,
        phase: "align",
      },
    }));

    const setPhase = (phase: GrabPhase) =>
      setAnimations((prev) => (prev[grabberId] ? { ...prev, [grabberId]: { ...prev[grabberId], phase } } : prev));

    const descendAt = ALIGN_MS;
    const grabAt = descendAt + DESCEND_MS;
    const riseAt = grabAt + GRAB_MS;
    const riseEndsAt = riseAt + RISE_MS;

    timers.push(setTimeout(() => setPhase("descend"), descendAt));
    timers.push(setTimeout(() => setPhase("grab"), grabAt));
    timers.push(setTimeout(() => setPhase("rise"), riseAt));

    const willDrop = outcome.gripped && !outcome.alreadyEmpty && !outcome.prize;
    const willCollect = outcome.gripped && !outcome.alreadyEmpty && outcome.prize;
    if (willDrop) {
      timers.push(setTimeout(() => setPhase("drop"), riseAt + DROP_DELAY_MS));
    } else if (willCollect) {
      timers.push(setTimeout(() => setPhase("collect"), riseEndsAt));
    }

    const totalMs = willDrop
      ? riseAt + DROP_DELAY_MS + DROP_MS + 150
      : willCollect
        ? riseEndsAt + COLLECT_MS + 150
        : riseEndsAt + 150;
    timers.push(
      setTimeout(() => {
        setAnimations((prev) => {
          if (!prev[grabberId]) return prev;
          const next = { ...prev };
          delete next[grabberId];
          return next;
        });
      }, totalMs)
    );

    animTimersRef.current[grabberId] = timers;
  }, []);

  const handleGrabResult = useCallback(
    (outcome: GrabOutcome) => {
      setToast(outcome);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 2500);
      scheduleGrabAnimation(outcome.playerId, outcome);
    },
    [scheduleGrabAnimation]
  );

  const { status, playerId, players, slots, roomFull, errorMessage, winner, sendMove, sendGrab } =
    useClawMachineSocket(roomId, nickname, handleGrabResult);
  const gameOver = Boolean(winner);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timersByPlayer = animTimersRef.current;
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      holdDirectionRef.current = null;
      if (holdIntervalRef.current !== null) clearInterval(holdIntervalRef.current);
      Object.values(timersByPlayer).forEach((timers) => timers.forEach(clearTimeout));
    };
  }, []);

  const self = playerId ? players[playerId] : undefined;
  const selfAnimating = playerId ? Boolean(animations[playerId]) : false;

  const updateLocalX = (x: number) => {
    localXRef.current = x;
    setLocalX(x);
    sendMove(x, 0);
  };

  const updateFromPointer = (clientX: number) => {
    if (selfAnimating || gameOver) return;
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    updateLocalX(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const stopHold = () => {
    holdDirectionRef.current = null;
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    window.removeEventListener("pointerup", stopHold);
    window.removeEventListener("pointercancel", stopHold);
    window.removeEventListener("blur", stopHold);
  };

  const startHold = (direction: 1 | -1) => {
    if (selfAnimating || gameOver) return;
    holdDirectionRef.current = direction;
    const holdStartedAt = Date.now();
    holdTsRef.current = holdStartedAt;

    // Window-level fallback: the button's own onPointerUp/onPointerCancel normally stop
    // the glide, but this also catches a release that lands outside the captured element
    // and a hard cutoff below guards against a hold that somehow never sees any release.
    // setInterval (not requestAnimationFrame) so the glide keeps ticking even if the tab
    // loses rendering focus mid-hold instead of silently freezing.
    window.addEventListener("pointerup", stopHold);
    window.addEventListener("pointercancel", stopHold);
    window.addEventListener("blur", stopHold);

    const MAX_HOLD_MS = 3000;
    const HOLD_TICK_MS = 30;

    holdIntervalRef.current = setInterval(() => {
      if (holdDirectionRef.current === null) return;
      const now = Date.now();
      if (now - holdStartedAt > MAX_HOLD_MS) {
        stopHold();
        return;
      }
      const dt = (now - holdTsRef.current) / 1000;
      holdTsRef.current = now;
      updateLocalX(Math.min(1, Math.max(0, localXRef.current + holdDirectionRef.current * HOLD_SPEED * dt)));
    }, HOLD_TICK_MS);
  };

  const handleLeftPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startHold(-1);
  };
  const handleRightPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startHold(1);
  };

  const handleGrab = () => {
    if (Date.now() < cooldownUntil || selfAnimating || gameOver) return;
    sendGrab();
    setCooldownUntil(Date.now() + GRAB_COOLDOWN_MS);
  };

  const getDisplayX = (pid: string, fallbackX: number): number => {
    const anim = animations[pid];
    return anim ? slotCenterX(anim.slotIndex) : fallbackX;
  };

  const getClawStyle = (pid: string, fallbackX: number, isSelf: boolean): CSSProperties => {
    const anim = animations[pid];
    const x = getDisplayX(pid, fallbackX);
    if (anim) {
      // "align" moves only left (lining up over the target), "descend"/"rise" move only
      // top — kept as separate phases so the drop itself always reads as dead straight.
      const downTarget = clawDownFor(anim.slotIndex);
      const top = anim.phase === "descend" || anim.phase === "grab" ? downTarget : CLAW_UP;
      const duration =
        anim.phase === "align"
          ? ALIGN_MS
          : anim.phase === "descend"
            ? DESCEND_MS
            : anim.phase === "grab"
              ? GRAB_MS
              : RISE_MS;
      return {
        left: `${x * 100}%`,
        top,
        transitionProperty: "left, top",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "ease-in-out",
      };
    }
    return {
      left: `${x * 100}%`,
      top: CLAW_UP,
      transitionProperty: isSelf ? "none" : "left",
      transitionDuration: isSelf ? "0ms" : "100ms",
    };
  };

  const getCapsuleStyle = (pid: string): CSSProperties | null => {
    const anim = animations[pid];
    if (!anim || anim.alreadyEmpty || !anim.gripped || anim.phase === "align" || anim.phase === "descend") {
      return null;
    }
    const x = slotCenterX(anim.slotIndex);
    const downTarget = clawDownFor(anim.slotIndex);

    if (anim.phase === "drop") {
      return {
        left: `${x * 100}%`,
        top: downTarget,
        opacity: 0.35,
        transform: "translateX(-50%) scale(1)",
        transitionProperty: "top, opacity, transform",
        transitionDuration: `${DROP_MS}ms`,
        transitionTimingFunction: "ease-in",
      };
    }
    if (anim.phase === "collect") {
      // Keeps rising well past the top of the machine and shrinks away — reads as
      // "sucked up and collected" rather than just stopping at the idle claw height.
      return {
        left: `${x * 100}%`,
        top: CLAW_UP - 46,
        opacity: 0,
        transform: "translateX(-50%) scale(0.35)",
        transitionProperty: "top, opacity, transform",
        transitionDuration: `${COLLECT_MS}ms`,
        transitionTimingFunction: "ease-in",
      };
    }
    const top = anim.phase === "grab" ? downTarget : CLAW_UP;
    const duration = anim.phase === "grab" ? GRAB_MS : RISE_MS;
    return {
      left: `${x * 100}%`,
      top,
      opacity: 1,
      transform: "translateX(-50%) scale(1)",
      transitionProperty: "left, top, opacity, transform",
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: "ease-in-out",
    };
  };

  const otherPlayers = Object.values(players).filter((p) => p.playerId !== playerId);
  const cooldownRemaining = Math.max(0, cooldownUntil - now);

  if (roomFull) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          🙏 이 방은 이미 가득 찼어요 (최대 6명). 새 방을 만들어보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
        <span>
          {status === "open" ? "🟢 연결됨" : status === "connecting" ? "🟡 연결 중..." : "🔴 연결 끊김, 재연결 중..."}
        </span>
        <span>{Object.keys(players).length}/6명 접속 중</span>
      </div>

      {winner && (
        <div className="mb-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-3 text-center shadow-lg shadow-amber-500/20">
          <p className="text-base font-extrabold text-amber-950">🏆 {winner.nickname}님 당첨! 🎉</p>
          <p className="mt-0.5 text-xs font-medium text-amber-900/80">게임이 종료됐어요. 새 방을 만들면 다시 즐길 수 있어요.</p>
        </div>
      )}

      {errorMessage && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {toast && (
        <div
          className={`mb-3 rounded-xl px-3 py-2 text-center text-sm font-bold ${
            toast.prize
              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          {players[toast.playerId]?.nickname ?? "누군가"}님이{" "}
          {toast.alreadyEmpty
            ? "빈 자리를 뽑았어요 😅"
            : !toast.gripped
              ? "잡았다가 놓쳤어요! 😖"
              : toast.prize
                ? "당첨! 🎉"
                : "꽝... 😢"}
        </div>
      )}

      {/* play area: drag rail + descending claws + capsule pile, all sharing one coordinate space */}
      <div
        className="relative touch-none overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-b from-neutral-100 to-white dark:border-white/5 dark:from-neutral-800 dark:to-neutral-900"
        style={{ height: CONTAINER_HEIGHT }}
      >
        {/* capsule pit floor, drawn behind the pile */}
        <div
          className="absolute inset-x-0 bottom-0 bg-neutral-50/80 dark:bg-neutral-800/40"
          style={{ top: PIT_TOP - 10 }}
        />

        <div
          ref={railRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-x-0 top-0 z-40 h-14 cursor-grab active:cursor-grabbing"
        />

        {/* piled capsules — random-looking, hand-placed positions, not a grid. Picked
            capsules are removed outright (not dimmed) so it's unambiguous which ones are
            still up for grabs; they pop back once their respawn window passes. */}
        {Array.from({ length: SLOT_COUNT }, (_, i) => slots[i]).map((slot, i) => {
          const available = slot ? isSlotAvailable(slot, now, RESPAWN_MS) : true;
          if (!available) return null;

          const spot = pileSpot(i);
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${spot.x * 100}%`,
                top: pileTopPx(spot.y),
                transform: `translate(-50%, -50%) rotate(${spot.rotation}deg) scale(${spot.scale})`,
                zIndex: Math.round(spot.y * 100),
              }}
            >
              <CapsuleIcon slotIndex={i} size={CAPSULE_SIZE} />
            </div>
          );
        })}

        {otherPlayers.map((p) => {
          const anim = animations[p.playerId];
          const capsuleStyle = getCapsuleStyle(p.playerId);
          return (
            <div key={p.playerId}>
              <div
                className="pointer-events-none absolute z-50 flex -translate-x-1/2 flex-col items-center"
                style={getClawStyle(p.playerId, p.x, false)}
              >
                <ClawIcon color={p.color} closed={anim?.phase === "grab"} size={30} />
                <span
                  className="-mt-1 max-w-[4rem] truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.nickname}
                </span>
              </div>
              {anim && capsuleStyle && (
                <span className="pointer-events-none absolute z-50" style={capsuleStyle}>
                  <CapsuleIcon slotIndex={anim.slotIndex} size={24} />
                </span>
              )}
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute z-50 flex -translate-x-1/2 flex-col items-center"
          style={getClawStyle(playerId ?? "", localX, true)}
        >
          <ClawIcon
            color={self?.color ?? "#3b82f6"}
            closed={Boolean(playerId && animations[playerId]?.phase === "grab")}
            size={38}
          />
          <span
            className="-mt-1 max-w-[4rem] truncate rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: self?.color ?? "#3b82f6" }}
          >
            나
          </span>
        </div>
        {playerId && animations[playerId] && getCapsuleStyle(playerId) && (
          <span className="pointer-events-none absolute z-50" style={getCapsuleStyle(playerId)!}>
            <CapsuleIcon slotIndex={animations[playerId].slotIndex} size={26} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onPointerDown={handleLeftPointerDown}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          disabled={selfAnimating || gameOver}
          aria-label="집게 왼쪽으로 이동 (누르고 있으면 계속 이동)"
          className="flex h-11 w-11 select-none items-center justify-center rounded-full border border-black/10 text-lg font-bold text-neutral-600 transition-colors active:scale-95 active:border-blue-400 active:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-neutral-300"
        >
          ◀
        </button>
        <span className="text-xs text-neutral-400">눌러서 이동, 꾹 누르면 쭉 이동</span>
        <button
          type="button"
          onPointerDown={handleRightPointerDown}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          disabled={selfAnimating || gameOver}
          aria-label="집게 오른쪽으로 이동 (누르고 있으면 계속 이동)"
          className="flex h-11 w-11 select-none items-center justify-center rounded-full border border-black/10 text-lg font-bold text-neutral-600 transition-colors active:scale-95 active:border-blue-400 active:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-neutral-300"
        >
          ▶
        </button>
      </div>

      <button
        type="button"
        onClick={handleGrab}
        disabled={cooldownRemaining > 0 || status !== "open" || selfAnimating || gameOver}
        className="mt-3 w-full rounded-2xl bg-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {gameOver ? "게임 종료" : cooldownRemaining > 0 ? `쿨타임 ${(cooldownRemaining / 1000).toFixed(1)}초` : "🎯 잡기"}
      </button>

      {gameOver ? (
        <div className="mt-3 text-center">
          <Link
            href="/claw-machine"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-600"
          >
            🎮 새 방 만들기
          </Link>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-neutral-400">
          위쪽 레일을 드래그하거나 좌우 버튼을 꾹 눌러서 내 집게를 움직이고, 원하는 캡슐 위에서 &apos;잡기&apos;를 눌러보세요.
        </p>
      )}
    </div>
  );
}
