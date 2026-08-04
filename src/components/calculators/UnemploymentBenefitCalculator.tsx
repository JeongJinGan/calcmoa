"use client";

import { useMemo, useState } from "react";
import { calculateUnemploymentBenefit, InsuredPeriod } from "@/lib/calculators/unemploymentBenefit";
import { formatWon, formatNumber } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

const INSURED_PERIOD_OPTIONS: { value: InsuredPeriod; label: string }[] = [
  { value: "under1", label: "1년 미만" },
  { value: "1to3", label: "1년~3년" },
  { value: "3to5", label: "3년~5년" },
  { value: "5to10", label: "5년~10년" },
  { value: "over10", label: "10년 이상" },
];

export default function UnemploymentBenefitCalculator() {
  const [birthDate, setBirthDate] = useState("1990-05-15");
  const [leaveDate, setLeaveDate] = useState("2026-07-24");
  const [insuredPeriod, setInsuredPeriod] = useState<InsuredPeriod>("1to3");
  const [recentThreeMonthsPay, setRecentThreeMonthsPay] = useState("9000000");

  const result = useMemo(
    () =>
      calculateUnemploymentBenefit({
        birthDate,
        leaveDate,
        insuredPeriod,
        recentThreeMonthsPay: Number(recentThreeMonthsPay) || 0,
      }),
    [birthDate, leaveDate, insuredPeriod, recentThreeMonthsPay],
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">생년월일</span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">이직(퇴사)일</span>
          <input
            type="date"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            이직 전 3개월간 총 급여 (세전, 원)
          </span>
          <AmountInput
            value={recentThreeMonthsPay}
            onChange={setRecentThreeMonthsPay}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">고용보험 가입기간</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {INSURED_PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInsuredPeriod(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                insuredPeriod === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">예상 실업급여 총액</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatWon(result.totalBenefit)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">이직 시 만나이</span>
            <span className="text-right font-medium">{result.ageAtLeave}세</span>
            <span className="text-neutral-600 dark:text-neutral-400">1일 평균임금</span>
            <span className="text-right font-medium">{formatWon(result.averageDailyWage)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">1일 구직급여액</span>
            <span className="text-right font-medium">
              {formatWon(result.dailyBenefit)}
              {result.isCapped && " (상한액 적용)"}
              {result.isFloored && " (하한액 적용)"}
            </span>
            <span className="text-neutral-600 dark:text-neutral-400">소정급여일수</span>
            <span className="text-right font-medium">{formatNumber(result.prescribedDays)}일</span>
          </div>
        </div>
      )}
    </div>
  );
}
