"use client";

import { useState } from "react";
import { GAME_PALETTE } from "@/lib/games/ladder";
import { computeSpinRotation, describeSlice, pickRandomIndex, sliceAngle } from "@/lib/games/roulette";

const SPIN_DURATION_MS = 4200;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;
const RADIUS = 140;
const CENTER = 150;

function truncate(label: string): string {
  return label.length > 7 ? `${label.slice(0, 7)}…` : label;
}

export default function RouletteGame() {
  const [options, setOptions] = useState<string[]>(["짜장면", "짬뽕", "볶음밥", "탕수육"]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const angle = sliceAngle(options.length);

  const handleSpin = () => {
    if (spinning || options.length < MIN_OPTIONS) return;
    const targetIndex = pickRandomIndex(options.length);
    setSpinning(true);
    setResultIndex(null);
    setRotation((prev) => computeSpinRotation(prev, targetIndex, options.length));
    setTimeout(() => {
      setSpinning(false);
      setResultIndex(targetIndex);
    }, SPIN_DURATION_MS);
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setResultIndex(null);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions((prev) => [...prev, `항목${prev.length + 1}`]);
    setResultIndex(null);
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="flex flex-col items-center">
        <div className="relative h-[280px] w-[280px]">
          <div
            aria-hidden
            className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-1"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "16px solid #171717",
            }}
          />
          <svg
            viewBox="0 0 300 300"
            width="100%"
            height="100%"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17,0.67,0.14,0.99)` : "none",
            }}
          >
            {options.map((label, i) => {
              const start = i * angle;
              const end = (i + 1) * angle;
              const mid = (start + end) / 2;
              return (
                <g key={i}>
                  <path
                    d={describeSlice(CENTER, CENTER, RADIUS, start, end)}
                    fill={GAME_PALETTE[i % GAME_PALETTE.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={CENTER}
                    y={CENTER - RADIUS * 0.68}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill="white"
                    transform={`rotate(${mid} ${CENTER} ${CENTER})`}
                  >
                    {truncate(label)}
                  </text>
                </g>
              );
            })}
            <circle cx={CENTER} cy={CENTER} r={16} fill="white" stroke="#e5e7eb" strokeWidth={2} />
          </svg>
        </div>

        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning || options.length < MIN_OPTIONS}
          className="mt-6 rounded-2xl bg-blue-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {spinning ? "돌아가는 중..." : "🎯 돌리기"}
        </button>

        {resultIndex !== null && (
          <p className="mt-4 rounded-2xl bg-blue-50 px-6 py-3 text-center text-lg font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            결과: {options[resultIndex]}
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-black/5 pt-5 dark:border-white/5">
        <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">선택지 편집</h3>
        <div className="space-y-2">
          {options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: GAME_PALETTE[i % GAME_PALETTE.length] }}
                aria-hidden
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-neutral-800 dark:focus:bg-neutral-800"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={options.length <= MIN_OPTIONS}
                aria-label="선택지 삭제"
                className="shrink-0 text-neutral-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          disabled={options.length >= MAX_OPTIONS}
          className="mt-3 w-full rounded-xl border border-dashed border-black/15 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-neutral-400"
        >
          + 선택지 추가
        </button>
      </div>
    </div>
  );
}
