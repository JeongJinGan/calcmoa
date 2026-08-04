"use client";

import { MonthlyTrendPoint } from "@/lib/calculators/householdBudget";
import { formatWon } from "@/lib/format";

const CHART_HEIGHT = 96;

function compactWon(value: number): string {
  if (value >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}천만`;
  if (value >= 100_000) return `${Math.round(value / 10_000)}만`;
  return formatWon(value);
}

function monthLabel(yearMonth: string): string {
  const [, month] = yearMonth.split("-");
  return `${Number(month)}월`;
}

export default function HouseholdBudgetTrendChart({ trend }: { trend: MonthlyTrendPoint[] }) {
  const maxValue = Math.max(1, ...trend.flatMap((point) => [point.totalIncome, point.totalExpense]));
  const lastIndex = trend.length - 1;

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" aria-hidden />
          수입
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600 dark:bg-red-500" aria-hidden />
          지출
        </span>
      </div>

      <div className="flex items-end justify-between gap-1" style={{ height: CHART_HEIGHT }}>
        {trend.map((point, index) => {
          const incomeHeight = point.totalIncome > 0 ? Math.max(2, Math.round((point.totalIncome / maxValue) * CHART_HEIGHT)) : 0;
          const expenseHeight = point.totalExpense > 0 ? Math.max(2, Math.round((point.totalExpense / maxValue) * CHART_HEIGHT)) : 0;
          const isLast = index === lastIndex;

          return (
            <div key={point.yearMonth} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className="flex items-end gap-[2px]">
                <div className="flex flex-col items-center">
                  {isLast && point.totalIncome > 0 && (
                    <span className="mb-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
                      {compactWon(point.totalIncome)}
                    </span>
                  )}
                  <div
                    role="img"
                    aria-label={`${point.yearMonth} 수입 ${formatWon(point.totalIncome)}`}
                    title={`${point.yearMonth} 수입: ${formatWon(point.totalIncome)}`}
                    className="w-3 rounded-t bg-blue-600 dark:bg-blue-500 sm:w-4"
                    style={{ height: incomeHeight }}
                  />
                </div>
                <div className="flex flex-col items-center">
                  {isLast && point.totalExpense > 0 && (
                    <span className="mb-0.5 text-[10px] font-medium text-red-700 dark:text-red-400">
                      {compactWon(point.totalExpense)}
                    </span>
                  )}
                  <div
                    role="img"
                    aria-label={`${point.yearMonth} 지출 ${formatWon(point.totalExpense)}`}
                    title={`${point.yearMonth} 지출: ${formatWon(point.totalExpense)}`}
                    className="w-3 rounded-t bg-red-600 dark:bg-red-500 sm:w-4"
                    style={{ height: expenseHeight }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{monthLabel(point.yearMonth)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-1 border-t border-neutral-300 dark:border-neutral-700" />
    </div>
  );
}
