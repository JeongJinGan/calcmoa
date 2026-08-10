// Decorative two-tone color pairs for capsule shells, cycled by slot index.
export const CAPSULE_COLOR_PAIRS: [string, string][] = [
  ["#fbbf24", "#fff7ed"],
  ["#38bdf8", "#e0f2fe"],
  ["#f87171", "#fee2e2"],
  ["#4ade80", "#ecfdf5"],
  ["#f472b6", "#fce7f3"],
  ["#a78bfa", "#ede9fe"],
  ["#fb923c", "#fff7ed"],
  ["#2dd4bf", "#ccfbf1"],
];

export function capsuleColorsForSlot(slotIndex: number): [string, string] {
  return CAPSULE_COLOR_PAIRS[slotIndex % CAPSULE_COLOR_PAIRS.length];
}

interface CapsuleIconProps {
  slotIndex: number;
  size?: number;
  cracked?: boolean;
}

/** A two-tone gashapon-style capsule sphere; splits apart slightly ("cracked") once revealed. */
export function CapsuleIcon({ slotIndex, size = 30, cracked = false }: CapsuleIconProps) {
  const [top, bottom] = capsuleColorsForSlot(slotIndex);
  const gap = cracked ? 3.5 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path d={`M 3,${20 - gap} A 17,17 0 0 1 37,${20 - gap} Z`} fill={top} stroke="#00000018" strokeWidth={0.75} />
      <path d={`M 3,${20 + gap} A 17,17 0 0 0 37,${20 + gap} Z`} fill={bottom} stroke="#00000018" strokeWidth={0.75} />
      <ellipse cx="14" cy={13 - gap} rx="5" ry="2.6" fill="white" opacity="0.55" />
    </svg>
  );
}

interface ClawIconProps {
  color: string;
  closed?: boolean;
  size?: number;
}

/** A crane-machine claw: a hub with two hinged prongs that swing shut on `closed`. */
export function ClawIcon({ color, closed = false, size = 40 }: ClawIconProps) {
  const angle = closed ? 30 : 6;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 64 72" aria-hidden>
      <line x1="32" y1="0" x2="32" y2="17" stroke="#78716c" strokeWidth="3" strokeLinecap="round" />
      <g
        style={{ transform: `rotate(${-angle}deg)`, transformOrigin: "32px 20px", transition: "transform 200ms ease-in-out" }}
      >
        <path
          d="M32,20 C20,24 14,37 17,51 C18,56 26,56 25,50 C23,40 26,30 34,24 Z"
          fill={color}
          stroke="#00000035"
          strokeWidth="1.5"
        />
      </g>
      <g
        style={{ transform: `rotate(${angle}deg)`, transformOrigin: "32px 20px", transition: "transform 200ms ease-in-out" }}
      >
        <path
          d="M32,20 C44,24 50,37 47,51 C46,56 38,56 39,50 C41,40 38,30 30,24 Z"
          fill={color}
          stroke="#00000035"
          strokeWidth="1.5"
        />
      </g>
      <circle cx="32" cy="19" r="7" fill={color} stroke="#00000035" strokeWidth="1.5" />
    </svg>
  );
}
