"use client";

import { useMemo, useState } from "react";
import { calculateBmi } from "@/lib/calculators/bmi";

export default function BmiCalculator() {
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("65");

  const result = useMemo(
    () => calculateBmi({ heightCm: Number(heightCm) || 0, weightKg: Number(weightKg) || 0 }),
    [heightCm, weightKg],
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">키 (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">몸무게 (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">BMI 지수</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {result.bmi.toFixed(1)} <span className="text-lg font-semibold">({result.category})</span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">표준 체중</span>
            <span className="text-right font-medium">{result.standardWeight.toFixed(1)}kg</span>
            <span className="text-neutral-600 dark:text-neutral-400">표준체중과의 차이</span>
            <span className="text-right font-medium">
              {result.weightDiff >= 0 ? "+" : ""}
              {result.weightDiff.toFixed(1)}kg
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
