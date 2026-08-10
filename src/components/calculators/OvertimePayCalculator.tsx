"use client";

import { useMemo, useState } from "react";
import {
  calculateOvertimePay,
  monthlyToHourlyWage,
  OvertimeInputMode,
} from "@/lib/calculators/overtimePay";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function OvertimePayCalculator() {
  const [mode, setMode] = useState<OvertimeInputMode>("hourly");
  const [hourlyWage, setHourlyWage] = useState("10030");
  const [monthlySalary, setMonthlySalary] = useState("2100000");
  const [overtimeHours, setOvertimeHours] = useState("10");
  const [nightHours, setNightHours] = useState("0");

  const effectiveHourlyWage =
    mode === "hourly" ? Number(hourlyWage) || 0 : monthlyToHourlyWage(Number(monthlySalary) || 0);

  const result = useMemo(
    () => calculateOvertimePay(effectiveHourlyWage, Number(overtimeHours) || 0, Number(nightHours) || 0),
    [effectiveHourlyWage, overtimeHours, nightHours]
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("hourly")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "hourly"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          시급으로 입력
        </button>
        <button
          type="button"
          onClick={() => setMode("monthly")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          월급으로 입력
        </button>
      </div>

      <div className="space-y-4">
        {mode === "hourly" ? (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">통상시급 (원)</span>
            <AmountInput
              value={hourlyWage}
              onChange={setHourlyWage}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">월 기본급 (원)</span>
            <AmountInput
              value={monthlySalary}
              onChange={setMonthlySalary}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
            <span className="mt-1 block text-xs text-neutral-400">
              월 소정근로시간 209시간 기준 통상시급 {formatWon(monthlyToHourlyWage(Number(monthlySalary) || 0))}
            </span>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">연장근로시간 (시간, 이번 달 합계)</span>
          <input
            type="number"
            inputMode="decimal"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
          <span className="mt-1 block text-xs text-neutral-400">1일 8시간 또는 1주 40시간을 초과해 근무한 시간</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">야간근로시간 (시간, 22시~06시)</span>
          <input
            type="number"
            inputMode="decimal"
            value={nightHours}
            onChange={(e) => setNightHours(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
          <span className="mt-1 block text-xs text-neutral-400">밤 10시부터 다음날 오전 6시 사이에 근무한 시간(연장근로와 중복 가능)</span>
        </label>
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">이번 달 예상 추가 수당</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatWon(result.totalExtraPay)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">통상시급</span>
            <span className="text-right font-medium">{formatWon(result.hourlyWage)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">연장근로수당 (시급×1.5)</span>
            <span className="text-right font-medium">{formatWon(result.overtimePay)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">야간근로수당 (시급×0.5 가산)</span>
            <span className="text-right font-medium">{formatWon(result.nightPay)}</span>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">통상시급은 0보다 크게 입력해주세요.</p>
      )}
    </div>
  );
}
