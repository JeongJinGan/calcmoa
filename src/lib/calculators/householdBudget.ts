export type BudgetEntryType = "income" | "expense";

export interface BudgetEntry {
  id: string;
  date: string;
  type: BudgetEntryType;
  category: string;
  amount: number;
  memo: string;
}

export const INCOME_CATEGORIES = ["급여", "부수입", "용돈", "기타수입"];
export const EXPENSE_CATEGORIES = [
  "식비",
  "교통",
  "주거/공과금",
  "통신",
  "쇼핑",
  "의료",
  "문화/여가",
  "교육",
  "경조사",
  "기타지출",
];

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function filterByMonth(entries: BudgetEntry[], yearMonth: string): BudgetEntry[] {
  return entries.filter((entry) => entry.date.startsWith(yearMonth));
}

export function summarize(entries: BudgetEntry[]): BudgetSummary {
  const totalIncome = entries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

export interface CategoryTotal {
  category: string;
  amount: number;
  ratio: number;
}

export function categoryBreakdown(entries: BudgetEntry[], type: BudgetEntryType): CategoryTotal[] {
  const filtered = entries.filter((e) => e.type === type);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const totals = new Map<string, number>();
  for (const entry of filtered) {
    totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount);
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount, ratio: total > 0 ? (amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export function shiftYearMonth(yearMonth: string, offset: number): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export interface MonthlyTrendPoint {
  yearMonth: string;
  totalIncome: number;
  totalExpense: number;
}

export function monthlyTrend(entries: BudgetEntry[], monthsCount: number, endYearMonth: string): MonthlyTrendPoint[] {
  const months = Array.from({ length: monthsCount }, (_, i) => shiftYearMonth(endYearMonth, i - (monthsCount - 1)));

  return months.map((yearMonth) => {
    const summary = summarize(filterByMonth(entries, yearMonth));
    return { yearMonth, totalIncome: summary.totalIncome, totalExpense: summary.totalExpense };
  });
}

export type BudgetGoals = Record<string, number>;

export interface BudgetGoalProgress {
  category: string;
  limit: number;
  spent: number;
  ratio: number;
  isOverBudget: boolean;
}

export function budgetGoalProgress(monthEntries: BudgetEntry[], goals: BudgetGoals): BudgetGoalProgress[] {
  const spentByCategory = new Map<string, number>();
  for (const entry of monthEntries) {
    if (entry.type !== "expense") continue;
    spentByCategory.set(entry.category, (spentByCategory.get(entry.category) ?? 0) + entry.amount);
  }

  return EXPENSE_CATEGORIES.filter((category) => (goals[category] ?? 0) > 0).map((category) => {
    const limit = goals[category];
    const spent = spentByCategory.get(category) ?? 0;
    return { category, limit, spent, ratio: (spent / limit) * 100, isOverBudget: spent > limit };
  });
}
