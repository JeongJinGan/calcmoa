"use client";

import { useState } from "react";
import {
  BudgetEntry,
  BudgetGoals,
  EXPENSE_CATEGORIES,
  budgetGoalProgress,
} from "@/lib/calculators/householdBudget";
import { formatWon } from "@/lib/format";

interface HouseholdBudgetGoalsProps {
  monthEntries: BudgetEntry[];
  goals: BudgetGoals;
  onSetGoal: (category: string, limit: number) => void;
  onRemoveGoal: (category: string) => void;
}

function meterColor(ratio: number): string {
  if (ratio >= 100) return "bg-red-500";
  if (ratio >= 80) return "bg-amber-500";
  return "bg-blue-500";
}

export default function HouseholdBudgetGoals({
  monthEntries,
  goals,
  onSetGoal,
  onRemoveGoal,
}: HouseholdBudgetGoalsProps) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  const progress = budgetGoalProgress(monthEntries, goals);
  const availableCategories = EXPENSE_CATEGORIES.filter((c) => !(goals[c] > 0));

  const handleAdd = () => {
    const parsedLimit = Number(limit) || 0;
    if (parsedLimit <= 0) return;
    onSetGoal(category, parsedLimit);
    setLimit("");
  };

  return (
    <div>
      {progress.length > 0 && (
        <div className="mb-4 space-y-3">
          {progress.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.category}</span>
                <span className="flex items-center gap-2">
                  <span className={item.isOverBudget ? "font-medium text-red-600 dark:text-red-400" : ""}>
                    {formatWon(item.spent)} / {formatWon(item.limit)}
                    {item.isOverBudget ? " · 예산 초과" : ` · ${item.ratio.toFixed(0)}%`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveGoal(item.category)}
                    aria-label={`${item.category} 예산 삭제`}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className={`h-2 rounded-full ${meterColor(item.ratio)}`}
                  style={{ width: `${Math.min(Math.max(item.ratio, 2), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {availableCategories.length > 0 && (
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-black/10 bg-neutral-50 px-2 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            inputMode="numeric"
            value={limit}
            onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="월 예산 (원)"
            className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            설정
          </button>
        </div>
      )}
    </div>
  );
}
