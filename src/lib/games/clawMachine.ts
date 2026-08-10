export const SLOT_COUNT = 12;
export const PRIZE_RATIO = 0.25;
export const RESPAWN_MS = 8000;
export const GRAB_COOLDOWN_MS = 1500;
export const ROOM_TTL_SECONDS = 600;
export const MAX_PLAYERS = 6;
// Real claw machines have weak grips — even a well-aimed grab often fails to lift
// anything. This is the chance a grab against an available capsule actually holds on.
export const GRIP_SUCCESS_RATE = 0.55;

export interface SlotState {
  state: "hidden" | "revealed";
  prize: boolean;
  revealedAt?: number;
}

export interface PlayerState {
  nickname: string;
  avatar: string;
  color: string;
  x: number;
  y: number;
  lastGrabAt: number;
}

export interface PublicPlayer extends PlayerState {
  playerId: string;
}

export interface PileSpot {
  /** Horizontal position within the play area, 0 (left) .. 1 (right). */
  x: number;
  /** Depth within the capsule pit, 0 (top of the heap) .. 1 (bottom, resting on the glass). */
  y: number;
  rotation: number;
  scale: number;
}

/**
 * Hand-placed capsule positions forming a heaped pile (like a real claw machine's capsule
 * pit) instead of a tidy grid — three loosely stacked rows, bottom row widest. Fixed and
 * identical for every room so every client renders the same pile without extra network data.
 */
export const PILE_LAYOUT: PileSpot[] = [
  { x: 0.1, y: 0.94, rotation: -12, scale: 1.0 },
  { x: 0.28, y: 0.98, rotation: 8, scale: 1.05 },
  { x: 0.48, y: 0.95, rotation: -5, scale: 1.0 },
  { x: 0.68, y: 0.97, rotation: 10, scale: 1.02 },
  { x: 0.9, y: 0.92, rotation: -15, scale: 0.98 },
  { x: 0.18, y: 0.74, rotation: 14, scale: 0.95 },
  { x: 0.38, y: 0.78, rotation: -8, scale: 0.92 },
  { x: 0.6, y: 0.76, rotation: 6, scale: 0.95 },
  { x: 0.8, y: 0.72, rotation: -10, scale: 0.9 },
  { x: 0.3, y: 0.56, rotation: -6, scale: 0.88 },
  { x: 0.52, y: 0.52, rotation: 12, scale: 0.9 },
  { x: 0.72, y: 0.58, rotation: -14, scale: 0.85 },
];

export function pileSpot(slotIndex: number): PileSpot {
  return PILE_LAYOUT[slotIndex % PILE_LAYOUT.length];
}

/**
 * Resolves a claw's horizontal position to whichever capsule in the pile sits closest to
 * it — not an even grid column — matching how a real claw drops onto whatever's nearest
 * underneath it.
 */
export function resolveSlotIndex(x: number, slotCount: number = SLOT_COUNT): number {
  const clamped = Math.min(1, Math.max(0, x));
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < slotCount; i++) {
    const dist = Math.abs(pileSpot(i).x - clamped);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/** Center x (0..1) of a capsule's pile position, for snapping the claw to it during a grab. */
export function slotCenterX(slotIndex: number): number {
  return pileSpot(slotIndex).x;
}

/** Randomly assigns prize slots at room creation, honoring the target ratio exactly. */
export function assignPrizeSlots(slotCount: number = SLOT_COUNT, ratio: number = PRIZE_RATIO): SlotState[] {
  const prizeCount = Math.round(slotCount * ratio);
  const indices = Array.from({ length: slotCount }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const prizeIndices = new Set(indices.slice(0, prizeCount));
  return Array.from({ length: slotCount }, (_, i) => ({ state: "hidden", prize: prizeIndices.has(i) }));
}

/** A revealed slot becomes available again after RESPAWN_MS, re-rolled independently at the target ratio. */
export function isSlotAvailable(slot: SlotState, now: number, respawnMs: number = RESPAWN_MS): boolean {
  if (slot.state === "hidden") return true;
  return slot.revealedAt !== undefined && now - slot.revealedAt > respawnMs;
}

export function rerollSlot(ratio: number = PRIZE_RATIO): SlotState {
  return { state: "hidden", prize: Math.random() < ratio };
}
