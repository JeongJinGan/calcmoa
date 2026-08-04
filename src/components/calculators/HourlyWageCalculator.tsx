"use client";

import { useMemo, useState } from "react";
import { calculateHourlyWage } from "@/lib/calculators/hourlyWage";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function HourlyWageCalculator() {
  const [hourlyWage, setHourlyWage] = useState("10030");
  const [weeklyHours, setWeeklyHours] = useState("20");

  const result = useMemo(
    () => calculateHourlyWage(Number(hourlyWage) || 0, Number(weeklyHours) || 0),
    [hourlyWage, weeklyHours]
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">시급 (원)</span>
          <AmountInput
            value={hourlyWage}
            onChange={setHourlyWage}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">주 소정근로시간 (시간)</span>
          <input
            type="number"
            inputMode="decimal"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">예상 월급 (세전, 주휴수당 포함)</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatWon(result.monthlyTotalPay)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">주급 (기본급)</span>
            <span className="text-right font-medium">{formatWon(result.weeklyBasePay)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">주휴수당</span>
            <span className="text-right font-medium">
              {result.isHolidayPayEligible ? formatWon(result.weeklyHolidayPay) : "미발생 (주 15시간 미만)"}
            </span>
            <span className="text-neutral-600 dark:text-neutral-400">주급 합계</span>
            <span className="text-right font-medium">{formatWon(result.weeklyTotalPay)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">실질 시급</span>
            <span className="text-right font-medium">{formatWon(result.effectiveHourlyRate)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
