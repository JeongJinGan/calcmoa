"use client";

import { useMemo, useState } from "react";
import { calculateLoan, RepaymentType } from "@/lib/calculators/loan";
import { formatWon } from "@/lib/format";

const REPAYMENT_TYPES: { value: RepaymentType; label: string }[] = [
  { value: "equalPayment", label: "원리금균등상환" },
  { value: "equalPrincipal", label: "원금균등상환" },
  { value: "bullet", label: "만기일시상환" },
];

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("100000000");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [termYears, setTermYears] = useState("10");
  const [type, setType] = useState<RepaymentType>("equalPayment");
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(
    () =>
      calculateLoan({
        principal: Number(principal) || 0,
        annualRatePercent: Number(annualRate) || 0,
        termMonths: (Number(termYears) || 0) * 12,
        type,
      }),
    [principal, annualRate, termYears, type],
  );

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {REPAYMENT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              type === t.value
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">대출 원금 (원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-right outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">연 이자율 (%)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-right outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">대출 기간 (년)</span>
          <input
            type="number"
            inputMode="numeric"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-right outline-none focus:border-blue-500 dark:border-white/15 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6">
          <div className="rounded-xl bg-blue-50 p-5 dark:bg-blue-950/30">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {type === "equalPayment" ? "월 상환액" : "첫 회차 상환액"}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
              {formatWon(result.firstMonthPayment)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
              <span className="text-neutral-600 dark:text-neutral-400">총 상환액</span>
              <span className="text-right font-medium">{formatWon(result.totalPayment)}</span>
              <span className="text-neutral-600 dark:text-neutral-400">총 이자</span>
              <span className="text-right font-medium text-red-500">{formatWon(result.totalInterest)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSchedule((v) => !v)}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {showSchedule ? "상환 스케줄 숨기기 ▲" : "월별 상환 스케줄 보기 ▼"}
          </button>

          {showSchedule && (
            <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-black/10 dark:border-white/10">
              <table className="w-full text-right text-xs">
                <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800">
                  <tr>
                    <th className="p-2 text-left">회차</th>
                    <th className="p-2">납입금</th>
                    <th className="p-2">원금</th>
                    <th className="p-2">이자</th>
                    <th className="p-2">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-t border-black/5 dark:border-white/5">
                      <td className="p-2 text-left">{row.month}회</td>
                      <td className="p-2">{formatWon(row.payment)}</td>
                      <td className="p-2">{formatWon(row.principalPaid)}</td>
                      <td className="p-2">{formatWon(row.interestPaid)}</td>
                      <td className="p-2">{formatWon(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
