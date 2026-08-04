"use client";

import { useEffect, useState } from "react";
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

interface SharedRouletteState {
  options: string[];
  resultIndex: number;
}

function readSharedState(): SharedRouletteState | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("result");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (
      Array.isArray(parsed.o) &&
      parsed.o.length >= MIN_OPTIONS &&
      parsed.o.length <= MAX_OPTIONS &&
      typeof parsed.i === "number" &&
      parsed.i >= 0 &&
      parsed.i < parsed.o.length
    ) {
      return { options: parsed.o, resultIndex: parsed.i };
    }
  } catch {
    // 잘못된 형식의 공유 링크는 무시하고 새 게임으로 시작
  }
  return null;
}

export default function RouletteGame() {
  const [sharedState] = useState<SharedRouletteState | null>(() => readSharedState());

  const [options, setOptions] = useState<string[]>(
    () => sharedState?.options ?? ["짜장면", "짬뽕", "볶음밥", "탕수육"]
  );
  const [rotation, setRotation] = useState(() =>
    sharedState ? computeSpinRotation(0, sharedState.resultIndex, sharedState.options.length, 0) : 0
  );
  const [spinning, setSpinning] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(() => sharedState?.resultIndex ?? null);
  const [shareCopied, setShareCopied] = useState(false);

  const angle = sliceAngle(options.length);

  useEffect(() => {
    if (!sharedState) return;
    window.history.replaceState(null, "", window.location.pathname);
    // 공유 링크로 들어온 결과를 한 번 불러온 뒤에는 주소창을 깔끔하게 정리한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setResultIndex(null);
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

  const handleShareResult = async () => {
    if (resultIndex === null) return;
    const payload = { o: options, i: resultIndex };
    const url = `${window.location.origin}${window.location.pathname}?result=${encodeURIComponent(
      JSON.stringify(payload)
    )}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "랜덤 룰렛 결과", text: "룰렛 결과를 확인해보세요!", url });
      } catch {
        // 사용자가 공유 시트를 취소한 경우 등은 조용히 무시
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // 클립보드 접근이 막힌 환경이면 조용히 무시
    }
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      {sharedState && (
        <div className="mb-4 rounded-xl bg-blue-50 p-3 text-center text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
          공유받은 룰렛 결과입니다. &apos;돌리기&apos;를 누르면 같은 선택지로 새로 뽑을 수 있어요.
        </div>
      )}

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
          <div className="mt-4 w-full space-y-3">
            <p className="rounded-2xl bg-blue-50 px-6 py-3 text-center text-lg font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              결과: {options[resultIndex]}
            </p>
            <button
              type="button"
              onClick={handleShareResult}
              className="w-full rounded-2xl border border-black/10 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:text-neutral-300"
            >
              {shareCopied ? "링크가 복사됐어요 ✓" : "🔗 이 결과 공유하기"}
            </button>
          </div>
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
