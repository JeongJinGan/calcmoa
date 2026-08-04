export type Rungs = boolean[][];

export function generateRungs(columns: number, rows: number): Rungs {
  const rungs: Rungs = [];

  for (let row = 0; row < rows; row++) {
    const rowRungs: boolean[] = new Array(columns - 1).fill(false);
    for (let col = 0; col < columns - 1; col++) {
      if (col > 0 && rowRungs[col - 1]) continue;
      rowRungs[col] = Math.random() < 0.35;
    }
    rungs.push(rowRungs);
  }

  return rungs;
}

export interface LadderStep {
  row: number;
  col: number;
}

export function tracePath(rungs: Rungs, startCol: number): { path: LadderStep[]; finalCol: number } {
  let col = startCol;
  const path: LadderStep[] = [{ row: -1, col }];

  for (let row = 0; row < rungs.length; row++) {
    if (col > 0 && rungs[row][col - 1]) {
      col -= 1;
    } else if (col < rungs[0].length && rungs[row][col]) {
      col += 1;
    }
    path.push({ row, col });
  }

  return { path, finalCol: col };
}

export const GAME_PALETTE = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#f43f5e",
  "#6366f1",
  "#eab308",
  "#22c55e",
];

export const AVATARS = [
  "🐶",
  "🐱",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐯",
  "🐨",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🦁",
  "🐮",
  "🐹",
];
