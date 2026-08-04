"use client";

import { useMemo, useState } from "react";
import { calculateIncomeTax } from "@/lib/calculators/incomeTax";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function IncomeTaxCalculator() {
  const [totalIncome, setTotalIncome] = useState("60000000");
  const [deductions, setDeductions] = useState("10000000");

  const result = useMemo(
    () =>
      calculateIncomeTax({
        totalIncome: Number(totalIncome) || 0,
        deductions: Number(deductions) || 0,
      }),
    [totalIncome, deductions],
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            종합소득금액 (연간, 원)
          </span>
          <AmountInput
            value={totalIncome}
            onChange={setTotalIncome}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">소득공제액 (연간, 원)</span>
          <AmountInput
            value={deductions}
            onChange={setDeductions}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">예상 총 납부세액 (지방소득세 포함)</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">{formatWon(result.totalTax)}</p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">과세표준</span>
            <span className="text-right font-medium">{formatWon(result.taxBase)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">산출세액(종합소득세)</span>
            <span className="text-right font-medium">{formatWon(result.calculatedTax)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">지방소득세(10%)</span>
            <span className="text-right font-medium">{formatWon(result.localIncomeTax)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">적용 한계세율</span>
            <span className="text-right font-medium">{result.marginalRatePercent.toFixed(0)}%</span>
            <span className="text-neutral-600 dark:text-neutral-400">실효세율</span>
            <span className="text-right font-medium">{result.effectiveRatePercent.toFixed(2)}%</span>
            <span className="text-neutral-600 dark:text-neutral-400">세후 소득</span>
            <span className="text-right font-medium">{formatWon(result.afterTaxIncome)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
