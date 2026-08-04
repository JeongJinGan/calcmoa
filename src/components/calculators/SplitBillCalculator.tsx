"use client";

import { useMemo, useState } from "react";
import { calculateEqualSplit, calculateSettlement, Payer } from "@/lib/calculators/splitBill";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

function createDefaultPayers(): Payer[] {
  return [
    { name: "나", paid: 0 },
    { name: "친구1", paid: 0 },
  ];
}

export default function SplitBillCalculator() {
  const [mode, setMode] = useState<"equal" | "settlement">("equal");

  const [totalAmount, setTotalAmount] = useState("60000");
  const [peopleCount, setPeopleCount] = useState("3");

  const [payers, setPayers] = useState<Payer[]>(createDefaultPayers());

  const equalShare = useMemo(
    () => calculateEqualSplit(Number(totalAmount) || 0, Number(peopleCount) || 0),
    [totalAmount, peopleCount]
  );

  const settlement = useMemo(() => calculateSettlement(payers), [payers]);

  const updatePayer = (index: number, field: "name" | "paid", value: string) => {
    setPayers((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [field]: field === "paid" ? Number(value) || 0 : value } : p
      )
    );
  };

  const addPayer = () => {
    setPayers((prev) => [...prev, { name: `친구${prev.length}`, paid: 0 }]);
  };

  const removePayer = (index: number) => {
    setPayers((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("equal")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "equal"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          단순 N분의 1
        </button>
        <button
          type="button"
          onClick={() => setMode("settlement")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            mode === "settlement"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          결제자별 정산
        </button>
      </div>

      {mode === "equal" ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">총 금액 (원)</span>
            <AmountInput
              value={totalAmount}
              onChange={setTotalAmount}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">인원 수 (명)</span>
            <input
              type="number"
              inputMode="numeric"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </label>

          {equalShare !== null && (
            <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">1인당 부담금</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
                {formatWon(equalShare)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            {payers.map((payer, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={payer.name}
                  onChange={(e) => updatePayer(index, "name", e.target.value)}
                  className="w-24 shrink-0 rounded-xl border border-black/10 bg-neutral-50 px-2 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
                />
                <AmountInput
                  value={payer.paid ? String(payer.paid) : ""}
                  onChange={(v) => updatePayer(index, "paid", v)}
                  placeholder="결제금액"
                  className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
                />
                <button
                  type="button"
                  onClick={() => removePayer(index)}
                  aria-label="삭제"
                  className="shrink-0 text-neutral-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPayer}
            className="mt-3 w-full rounded-lg border border-dashed border-black/20 py-2 text-sm text-neutral-500 hover:border-blue-400 hover:text-blue-600 dark:border-white/20 dark:text-neutral-400"
          >
            + 인원 추가
          </button>

          {settlement && (
            <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">1인당 부담금 (총 {formatWon(settlement.totalAmount)})</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
                {formatWon(settlement.share)}
              </p>

              <div className="mt-5 border-t border-blue-200/60 pt-4 dark:border-blue-900/40">
                {settlement.transfers.length === 0 ? (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">이미 정산이 맞아 이체할 금액이 없습니다.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {settlement.transfers.map((t, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span className="text-neutral-700 dark:text-neutral-300">
                          {t.from} → {t.to}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatWon(t.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
