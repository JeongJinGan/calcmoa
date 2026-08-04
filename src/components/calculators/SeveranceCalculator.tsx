"use client";

import { useMemo, useState } from "react";
import { calculateSeverance } from "@/lib/calculators/severance";
import { formatWon, formatNumber } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function SeveranceCalculator() {
  const [hireDate, setHireDate] = useState("2022-01-02");
  const [resignDate, setResignDate] = useState("2026-07-24");
  const [recentThreeMonthsPay, setRecentThreeMonthsPay] = useState("12000000");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState("0");

  const result = useMemo(
    () =>
      calculateSeverance({
        hireDate,
        resignDate,
        recentThreeMonthsPay: Number(recentThreeMonthsPay) || 0,
        annualBonus: Number(annualBonus) || 0,
        annualLeaveAllowance: Number(annualLeaveAllowance) || 0,
      }),
    [hireDate, resignDate, recentThreeMonthsPay, annualBonus, annualLeaveAllowance],
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">입사일</span>
          <input
            type="date"
            value={hireDate}
            onChange={(e) => setHireDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">퇴사일</span>
          <input
            type="date"
            value={resignDate}
            onChange={(e) => setResignDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            퇴직 전 3개월간 총 급여 (세전, 원)
          </span>
          <AmountInput
            value={recentThreeMonthsPay}
            onChange={setRecentThreeMonthsPay}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">최근 1년 상여금 총액 (원)</span>
          <AmountInput
            value={annualBonus}
            onChange={setAnnualBonus}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">최근 1년 연차수당 총액 (원)</span>
          <AmountInput
            value={annualLeaveAllowance}
            onChange={setAnnualLeaveAllowance}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          {result.isEligible ? (
            <>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">예상 퇴직금</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
                {formatWon(result.severancePay)}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
                <span className="text-neutral-600 dark:text-neutral-400">총 재직일수</span>
                <span className="text-right font-medium">{formatNumber(result.workedDays)}일</span>
                <span className="text-neutral-600 dark:text-neutral-400">재직기간(년)</span>
                <span className="text-right font-medium">{result.workedYears.toFixed(2)}년</span>
                <span className="text-neutral-600 dark:text-neutral-400">1일 평균임금</span>
                <span className="text-right font-medium">{formatWon(result.averageDailyWage)}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              계속근로기간이 1년 미만이면 퇴직금 지급 대상이 아닙니다. (현재 재직일수:{" "}
              {formatNumber(result.workedDays)}일)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
