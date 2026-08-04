"use client";

import { useEffect, useState } from "react";
import { AVATARS, GAME_PALETTE, generateRungs, tracePath, type Rungs } from "@/lib/games/ladder";

const COL_SPACING = 72;
const ROW_HEIGHT = 26;
const PADDING = COL_SPACING / 2;
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 15;

function rowsFor(columns: number): number {
  return Math.min(16, Math.max(9, columns * 3));
}

function defaultResults(n: number): string[] {
  return Array.from({ length: n }, (_, i) => (i === 0 ? "🎉 당첨" : "꽝"));
}

function defaultParticipants(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `참가자${i + 1}`);
}

export default function LadderGame() {
  const [participants, setParticipants] = useState<string[]>(defaultParticipants(4));
  const [results, setResults] = useState<string[]>(defaultResults(4));
  const [rungs, setRungs] = useState<Rungs>(() => generateRungs(4, rowsFor(4)));
  const [revealed, setRevealed] = useState<Record<number, number>>({});
  const [animatingCol, setAnimatingCol] = useState<number | null>(null);
  const [animatingStep, setAnimatingStep] = useState(0);
  const [countInput, setCountInput] = useState("4");

  const columns = participants.length;
  const rows = rowsFor(columns);
  const svgWidth = PADDING * 2 + (columns - 1) * COL_SPACING;
  const svgHeight = PADDING * 2 + rows * ROW_HEIGHT;

  const colX = (i: number) => PADDING + i * COL_SPACING;
  const pathY = (k: number) => PADDING + k * ROW_HEIGHT;

  useEffect(() => {
    if (animatingCol === null) return;
    const { path, finalCol } = tracePath(rungs, animatingCol);

    const timer = setTimeout(() => {
      if (animatingStep >= path.length - 1) {
        setRevealed((prev) => ({ ...prev, [animatingCol]: finalCol }));
        setAnimatingCol(null);
      } else {
        setAnimatingStep((s) => s + 1);
      }
    }, 90);

    return () => clearTimeout(timer);
  }, [animatingCol, animatingStep, rungs]);

  const reshuffle = () => {
    setRungs(generateRungs(columns, rowsFor(columns)));
    setRevealed({});
    setAnimatingCol(null);
    setAnimatingStep(0);
  };

  const changeParticipantCount = (n: number) => {
    if (n < MIN_PARTICIPANTS || n > MAX_PARTICIPANTS) return;
    setParticipants(defaultParticipants(n));
    setResults(defaultResults(n));
    setRungs(generateRungs(n, rowsFor(n)));
    setRevealed({});
    setAnimatingCol(null);
    setAnimatingStep(0);
  };

  const commitParticipantCount = () => {
    const clamped = Math.min(MAX_PARTICIPANTS, Math.max(MIN_PARTICIPANTS, Number(countInput) || columns));
    setCountInput(String(clamped));
    if (clamped !== columns) changeParticipantCount(clamped);
  };

  const handleStart = (col: number) => {
    if (animatingCol !== null || revealed[col] !== undefined) return;
    setAnimatingCol(col);
    setAnimatingStep(0);
  };

  const revealAll = () => {
    if (animatingCol !== null) return;
    setRevealed((prev) => {
      const next = { ...prev };
      for (let i = 0; i < columns; i++) {
        if (next[i] === undefined) next[i] = tracePath(rungs, i).finalCol;
      }
      return next;
    });
  };

  const allRevealed = Object.keys(revealed).length === columns;
  const cardWidth = Math.min(760, Math.max(svgWidth + 56, 420));
  const markerPos = animatingCol !== null ? tracePath(rungs, animatingCol).path[animatingStep] : null;

  return (
    <div
      className="mx-auto rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7"
      style={{ maxWidth: cardWidth }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          인원 수
          <input
            type="number"
            min={MIN_PARTICIPANTS}
            max={MAX_PARTICIPANTS}
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            onBlur={commitParticipantCount}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="w-16 rounded-lg border border-black/10 bg-neutral-50 px-2 py-1.5 text-center text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={revealAll}
            disabled={animatingCol !== null || allRevealed}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-neutral-300"
          >
            🔍 결과 한번에 보기
          </button>
          <button
            type="button"
            onClick={reshuffle}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:text-neutral-300"
          >
            🔀 새로 섞기
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div style={{ width: svgWidth, minWidth: svgWidth }}>
          <div className="flex">
            {participants.map((name, i) => (
              <div key={i} style={{ width: COL_SPACING }} className="flex flex-col items-center px-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setParticipants((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
                  }
                  className="w-full rounded-lg border border-black/10 bg-neutral-50 px-1 py-1 text-center text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-neutral-800"
                />
                <button
                  type="button"
                  onClick={() => handleStart(i)}
                  disabled={animatingCol !== null || revealed[i] !== undefined}
                  className={`relative mt-1 text-2xl transition-all disabled:cursor-not-allowed ${
                    revealed[i] !== undefined ? "opacity-40 grayscale" : "hover:-translate-y-0.5"
                  } ${animatingCol === i ? "opacity-0" : ""}`}
                  aria-label={`${name} 시작`}
                >
                  {AVATARS[i % AVATARS.length]}
                  {revealed[i] !== undefined && (
                    <span className="absolute -right-1 -top-1 text-xs">✅</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="relative mt-1" style={{ width: svgWidth, height: svgHeight }}>
            <svg width={svgWidth} height={svgHeight}>
              {Array.from({ length: columns }, (_, i) => (
                <line
                  key={i}
                  x1={colX(i)}
                  y1={PADDING}
                  x2={colX(i)}
                  y2={PADDING + rows * ROW_HEIGHT}
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-neutral-200 dark:text-neutral-700"
                />
              ))}

              {Object.keys(revealed).map((key) => {
                const col = Number(key);
                if (col === animatingCol) return null;
                const { path } = tracePath(rungs, col);
                const points = path.map((p, k) => `${colX(p.col)},${pathY(k)}`).join(" ");
                return (
                  <polyline
                    key={col}
                    points={points}
                    fill="none"
                    stroke={GAME_PALETTE[col % GAME_PALETTE.length]}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.55}
                  />
                );
              })}

              {animatingCol !== null &&
                (() => {
                  const { path } = tracePath(rungs, animatingCol);
                  const visible = path.slice(0, animatingStep + 1);
                  const points = visible.map((p, k) => `${colX(p.col)},${pathY(k)}`).join(" ");
                  return (
                    <polyline
                      points={points}
                      fill="none"
                      stroke={GAME_PALETTE[animatingCol % GAME_PALETTE.length]}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}
            </svg>

            {markerPos && (
              <div
                className="pointer-events-none absolute text-2xl transition-all duration-100 ease-linear"
                style={{
                  left: colX(markerPos.col),
                  top: pathY(animatingStep),
                  transform: "translate(-50%, -50%)",
                }}
              >
                {AVATARS[(animatingCol ?? 0) % AVATARS.length]}
              </div>
            )}
          </div>

          <div className="flex">
            {results.map((result, i) => {
              const revealedCol = Object.entries(revealed).find(([, finalCol]) => finalCol === i)?.[0];
              return (
                <div key={i} style={{ width: COL_SPACING }} className="flex flex-col items-center px-1">
                  <input
                    type="text"
                    value={result}
                    onChange={(e) => setResults((prev) => prev.map((r, idx) => (idx === i ? e.target.value : r)))}
                    className="w-full rounded-lg border border-black/10 bg-neutral-50 px-1 py-1 text-center text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-neutral-800"
                  />
                  {revealedCol !== undefined && (
                    <span
                      className="mt-1 text-[10px] font-semibold"
                      style={{ color: GAME_PALETTE[Number(revealedCol) % GAME_PALETTE.length] }}
                    >
                      ← {participants[Number(revealedCol)]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {allRevealed && (
        <p className="mt-5 rounded-2xl bg-blue-50 p-4 text-center text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
          모든 결과가 공개됐어요! 다시 하려면 &apos;새로 섞기&apos;를 눌러주세요.
        </p>
      )}
    </div>
  );
}
