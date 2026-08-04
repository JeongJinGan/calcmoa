"use client";

import { useMemo, useState } from "react";
import { calculateVat, VatMode } from "@/lib/calculators/vat";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function VatCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [mode, setMode] = useState<VatMode>("fromSupply");

  const result = useMemo(() => calculateVat(Number(amount) || 0, mode), [amount, mode]);

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("fromSupply")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "fromSupply"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          공급가액으로 계산
        </button>
        <button
          type="button"
          onClick={() => setMode("fromTotal")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "fromTotal"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          합계금액으로 계산
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {mode === "fromSupply" ? "공급가액 (원)" : "합계금액 (부가세 포함, 원)"}
        </span>
        <AmountInput
          value={amount}
          onChange={setAmount}
          className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
        />
      </label>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">부가가치세 (10%)</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">{formatWon(result.vatAmount)}</p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">공급가액</span>
            <span className="text-right font-medium">{formatWon(result.supplyAmount)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">부가세</span>
            <span className="text-right font-medium">{formatWon(result.vatAmount)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">합계금액</span>
            <span className="text-right font-medium">{formatWon(result.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
