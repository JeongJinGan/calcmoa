"use client";

import { useMemo, useState } from "react";
import { calculateSavingsInterest, SavingsMode, TaxOption } from "@/lib/calculators/savingsInterest";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

const TAX_OPTIONS: { value: TaxOption; label: string }[] = [
  { value: "general", label: "일반과세 (15.4%)" },
  { value: "preferential", label: "세금우대 (9.5%)" },
  { value: "taxFree", label: "비과세 (0%)" },
];

export default function SavingsInterestCalculator() {
  const [mode, setMode] = useState<SavingsMode>("lumpSum");
  const [amount, setAmount] = useState("10000000");
  const [annualRate, setAnnualRate] = useState("3.5");
  const [months, setMonths] = useState("12");
  const [taxOption, setTaxOption] = useState<TaxOption>("general");

  const result = useMemo(
    () =>
      calculateSavingsInterest({
        mode,
        amount: Number(amount) || 0,
        annualRatePercent: Number(annualRate) || 0,
        months: Number(months) || 0,
        taxOption,
      }),
    [mode, amount, annualRate, months, taxOption],
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("lumpSum")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "lumpSum"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          예금 (거치식)
        </button>
        <button
          type="button"
          onClick={() => setMode("installment")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "installment"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          적금 (적립식)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {mode === "lumpSum" ? "예치 원금 (원)" : "매월 납입액 (원)"}
          </span>
          <AmountInput
            value={amount}
            onChange={setAmount}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
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
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">가입 기간 (개월)</span>
          <input
            type="number"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">이자 과세 방식</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {TAX_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTaxOption(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                taxOption === opt.value
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
          <p className="text-sm text-neutral-600 dark:text-neutral-400">만기 수령액</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatWon(result.maturityAmount)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">원금 합계</span>
            <span className="text-right font-medium">{formatWon(result.principal)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">세전 이자</span>
            <span className="text-right font-medium">{formatWon(result.grossInterest)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">이자 과세</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.tax)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">세후 이자</span>
            <span className="text-right font-medium">{formatWon(result.netInterest)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
