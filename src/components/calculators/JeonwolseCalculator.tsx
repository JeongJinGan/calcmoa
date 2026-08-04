"use client";

import { useMemo, useState } from "react";
import { calculateJeonwolse, JeonwolseMode } from "@/lib/calculators/jeonwolse";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function JeonwolseCalculator() {
  const [mode, setMode] = useState<JeonwolseMode>("jeonseToWolse");
  const [wolseDeposit, setWolseDeposit] = useState("10000000");
  const [conversionRate, setConversionRate] = useState("5.5");
  const [jeonseDeposit, setJeonseDeposit] = useState("200000000");
  const [monthlyRent, setMonthlyRent] = useState("500000");

  const result = useMemo(
    () =>
      calculateJeonwolse(
        mode,
        Number(wolseDeposit) || 0,
        Number(conversionRate) || 0,
        mode === "jeonseToWolse" ? Number(jeonseDeposit) || 0 : Number(monthlyRent) || 0
      ),
    [mode, wolseDeposit, conversionRate, jeonseDeposit, monthlyRent]
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("jeonseToWolse")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "jeonseToWolse"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          전세 → 월세 전환
        </button>
        <button
          type="button"
          onClick={() => setMode("wolseToJeonse")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "wolseToJeonse"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          월세 → 전세 환산
        </button>
      </div>

      <div className="space-y-4">
        {mode === "jeonseToWolse" ? (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">전세보증금 (원)</span>
            <AmountInput
              value={jeonseDeposit}
              onChange={setJeonseDeposit}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">월세 (원)</span>
            <AmountInput
              value={monthlyRent}
              onChange={setMonthlyRent}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            전환 후 월세보증금 (반전세 보증금, 원)
          </span>
          <AmountInput
            value={wolseDeposit}
            onChange={setWolseDeposit}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">전월세 전환율 (%, 연)</span>
          <input
            type="number"
            inputMode="decimal"
            value={conversionRate}
            onChange={(e) => setConversionRate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {mode === "jeonseToWolse" ? "예상 월세" : "환산 전세보증금"}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {mode === "jeonseToWolse" ? formatWon(result.monthlyRent) : formatWon(result.jeonseDeposit)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">전세보증금(환산)</span>
            <span className="text-right font-medium">{formatWon(result.jeonseDeposit)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">월세보증금</span>
            <span className="text-right font-medium">{formatWon(result.wolseDeposit)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">월세</span>
            <span className="text-right font-medium">{formatWon(result.monthlyRent)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">적용 전환율</span>
            <span className="text-right font-medium">{result.conversionRate}%</span>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          전세보증금은 월세보증금보다 커야 하며, 전환율은 0보다 커야 합니다.
        </p>
      )}
    </div>
  );
}
