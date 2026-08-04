"use client";

import { useMemo, useState } from "react";
import { calculateBreakEven } from "@/lib/calculators/breakEven";
import { formatNumber, formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function BreakEvenCalculator() {
  const [fixedCost, setFixedCost] = useState("3000000");
  const [variableCost, setVariableCost] = useState("4000");
  const [price, setPrice] = useState("10000");

  const result = useMemo(
    () => calculateBreakEven(Number(fixedCost) || 0, Number(variableCost) || 0, Number(price) || 0),
    [fixedCost, variableCost, price]
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">월 고정비 (임대료, 인건비 등, 원)</span>
          <AmountInput
            value={fixedCost}
            onChange={setFixedCost}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">개당 변동비 (원가, 재료비 등, 원)</span>
          <AmountInput
            value={variableCost}
            onChange={setVariableCost}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">개당 판매단가 (원)</span>
          <AmountInput
            value={price}
            onChange={setPrice}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">손익분기 판매량</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatNumber(result.breakEvenUnits)}개
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">손익분기 매출액</span>
            <span className="text-right font-medium">{formatWon(result.breakEvenRevenue)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">개당 공헌이익</span>
            <span className="text-right font-medium">{formatWon(result.contributionMargin)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">공헌이익률</span>
            <span className="text-right font-medium">{result.contributionMarginRate.toFixed(1)}%</span>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          판매단가가 변동비보다 커야 손익분기점을 계산할 수 있습니다.
        </p>
      )}
    </div>
  );
}
