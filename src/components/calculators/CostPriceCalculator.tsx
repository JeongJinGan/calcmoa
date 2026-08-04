"use client";

import { useMemo, useState } from "react";
import { calculateCostPrice, CostPriceMode } from "@/lib/calculators/costPrice";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function CostPriceCalculator() {
  const [mode, setMode] = useState<CostPriceMode>("priceFromMargin");
  const [cost, setCost] = useState("10000");
  const [feeRate, setFeeRate] = useState("0");
  const [marginRate, setMarginRate] = useState("30");
  const [sellingPrice, setSellingPrice] = useState("20000");

  const result = useMemo(
    () =>
      calculateCostPrice(
        mode,
        Number(cost) || 0,
        Number(feeRate) || 0,
        mode === "priceFromMargin" ? Number(marginRate) || 0 : Number(sellingPrice) || 0
      ),
    [mode, cost, feeRate, marginRate, sellingPrice]
  );

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("priceFromMargin")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "priceFromMargin"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          목표 마진율로 판매가 계산
        </button>
        <button
          type="button"
          onClick={() => setMode("marginFromPrice")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "marginFromPrice"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          판매가로 마진율 계산
        </button>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">원가 (개당, 원)</span>
          <AmountInput
            value={cost}
            onChange={setCost}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">판매 수수료율 (%, 오픈마켓 등)</span>
          <input
            type="number"
            inputMode="decimal"
            value={feeRate}
            onChange={(e) => setFeeRate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>

        {mode === "priceFromMargin" ? (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">목표 마진율 (%)</span>
            <input
              type="number"
              inputMode="decimal"
              value={marginRate}
              onChange={(e) => setMarginRate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">판매가 (원)</span>
            <AmountInput
              value={sellingPrice}
              onChange={setSellingPrice}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
        )}
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {mode === "priceFromMargin" ? "권장 판매가" : "마진율"}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {mode === "priceFromMargin" ? formatWon(result.sellingPrice) : `${result.marginRate.toFixed(1)}%`}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">판매가</span>
            <span className="text-right font-medium">{formatWon(result.sellingPrice)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">원가</span>
            <span className="text-right font-medium">{formatWon(result.cost)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">수수료</span>
            <span className="text-right font-medium">{formatWon(result.feeAmount)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">마진(이익)</span>
            <span className="text-right font-medium">{formatWon(result.marginAmount)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">마진율</span>
            <span className="text-right font-medium">{result.marginRate.toFixed(1)}%</span>
            <span className="text-neutral-600 dark:text-neutral-400">원가율</span>
            <span className="text-right font-medium">{result.costRate.toFixed(1)}%</span>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          수수료율과 목표 마진율의 합이 100% 미만이 되도록 입력해주세요.
        </p>
      )}
    </div>
  );
}
