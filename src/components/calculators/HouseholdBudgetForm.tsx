"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BudgetEntry,
  BudgetEntryType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  categoryBreakdown,
  filterByMonth,
  monthlyTrend,
  summarize,
} from "@/lib/calculators/householdBudget";
import {
  RecurringTemplate,
  addBudgetEntries,
  addBudgetEntry,
  addTemplate,
  getEntriesSnapshot,
  getGoalsSnapshot,
  getServerEntriesSnapshot,
  getServerGoalsSnapshot,
  getServerTemplatesSnapshot,
  getTemplatesSnapshot,
  removeBudgetEntry,
  removeBudgetGoal,
  removeTemplate,
  setBudgetGoal,
  subscribe,
} from "@/lib/calculators/householdBudgetStore";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";
import HouseholdBudgetTrendChart from "@/components/calculators/household-budget/HouseholdBudgetTrendChart";
import HouseholdBudgetGoals from "@/components/calculators/household-budget/HouseholdBudgetGoals";
import HouseholdBudgetTemplates from "@/components/calculators/household-budget/HouseholdBudgetTemplates";
import HouseholdBudgetCsvTools from "@/components/calculators/household-budget/HouseholdBudgetCsvTools";

type Tab = "entry" | "insights";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentYearMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function HouseholdBudgetForm() {
  const entries = useSyncExternalStore(subscribe, getEntriesSnapshot, getServerEntriesSnapshot);
  const goals = useSyncExternalStore(subscribe, getGoalsSnapshot, getServerGoalsSnapshot);
  const templates = useSyncExternalStore(subscribe, getTemplatesSnapshot, getServerTemplatesSnapshot);
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth());
  const [tab, setTab] = useState<Tab>("entry");

  const [type, setType] = useState<BudgetEntryType>("expense");
  const [date, setDate] = useState(todayIso());
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const monthEntries = useMemo(() => filterByMonth(entries, selectedMonth), [entries, selectedMonth]);
  const summary = useMemo(() => summarize(monthEntries), [monthEntries]);
  const expenseBreakdown = useMemo(() => categoryBreakdown(monthEntries, "expense"), [monthEntries]);
  const trend = useMemo(() => monthlyTrend(entries, 6, selectedMonth), [entries, selectedMonth]);
  const sortedEntries = useMemo(
    () => [...monthEntries].sort((a, b) => b.date.localeCompare(a.date)),
    [monthEntries]
  );

  const handleTypeChange = (nextType: BudgetEntryType) => {
    setType(nextType);
    setCategory(nextType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleAdd = () => {
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount <= 0 || !date) return;

    addBudgetEntry({ id: createId(), date, type, category, amount: parsedAmount, memo });
    setAmount("");
    setMemo("");
  };

  const handleDelete = (id: string) => {
    removeBudgetEntry(id);
  };

  const handleQuickAddTemplate = (template: RecurringTemplate) => {
    addBudgetEntry({
      id: createId(),
      date: todayIso(),
      type: template.type,
      category: template.category,
      amount: template.amount,
      memo: template.label,
    });
  };

  const handleCsvImport = (imported: Omit<BudgetEntry, "id">[]) => {
    addBudgetEntries(imported.map((entry) => ({ ...entry, id: createId() })));
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="mb-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        이 가계부는 서버에 저장되지 않고 <strong>이 브라우저에만</strong> 남습니다. 브라우저 데이터를 지우거나 다른
        기기·브라우저로 바꾸면 내역이 사라지니, <strong>통계·설정 탭의 &apos;CSV 내보내기&apos;</strong>로
        주기적으로 저장해두세요.
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">조회 월</span>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            if (/^\d{4}-\d{2}$/.test(e.target.value)) setSelectedMonth(e.target.value);
          }}
          className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-blue-50 p-4 text-center dark:bg-blue-500/10">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">총수입</p>
          <p className="mt-1 font-bold text-blue-700 dark:text-blue-400">{formatWon(summary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">총지출</p>
          <p className="mt-1 font-bold text-red-600 dark:text-red-400">{formatWon(summary.totalExpense)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">잔액</p>
          <p className="mt-1 font-bold text-neutral-800 dark:text-neutral-100">{formatWon(summary.balance)}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 border-b border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={() => setTab("entry")}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            tab === "entry"
              ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          가계부 입력
        </button>
        <button
          type="button"
          onClick={() => setTab("insights")}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            tab === "insights"
              ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          통계·설정
        </button>
      </div>

      {tab === "entry" ? (
        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  type === "expense"
                    ? "bg-red-600 text-white"
                    : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                지출
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  type === "income"
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                수입
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">날짜</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
                />
              </label>
              <label className="block">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">카테고리</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">금액 (원)</span>
              <AmountInput
                value={amount}
                onChange={setAmount}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
              />
            </label>

            <label className="block">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">메모 (선택)</span>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 점심 식사"
                className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
              />
            </label>

            {templates.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleQuickAddTemplate(template)}
                    className="flex items-center gap-1.5 rounded-full border border-black/5 bg-neutral-50 py-1 pl-3 pr-3 text-xs transition-shadow hover:shadow-sm dark:border-white/5 dark:bg-neutral-800"
                  >
                    <span
                      className={`font-medium ${
                        template.type === "income"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      +
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">{template.label}</span>
                    <span className="text-neutral-400">{formatWon(template.amount)}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-2xl bg-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              내역 추가
            </button>
          </div>

          <div className="space-y-6 lg:border-l lg:border-black/10 lg:pl-6 dark:lg:border-white/10">
            {expenseBreakdown.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">지출 카테고리별 비중</h3>
                <div className="space-y-2">
                  {expenseBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                        <span>{item.category}</span>
                        <span>
                          {formatWon(item.amount)} ({item.ratio.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{ width: `${Math.max(item.ratio, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={expenseBreakdown.length > 0 ? "border-t border-black/10 pt-5 dark:border-white/10" : ""}>
            <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {selectedMonth} 내역 ({sortedEntries.length}건)
            </h3>
            {sortedEntries.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">등록된 내역이 없습니다.</p>
            ) : (
              <ul className="divide-y divide-black/5 dark:divide-white/5">
                {sortedEntries.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="text-neutral-800 dark:text-neutral-200">
                        <span className="mr-2 text-xs text-neutral-400">{entry.date}</span>
                        {entry.category}
                        {entry.memo && <span className="ml-2 text-neutral-400">· {entry.memo}</span>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`font-medium ${
                          entry.type === "income"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {entry.type === "income" ? "+" : "-"}
                        {formatWon(entry.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        aria-label="삭제"
                        className="text-neutral-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">고정 지출 템플릿</h3>
            <HouseholdBudgetTemplates
              templates={templates}
              onAdd={(template) => addTemplate({ ...template, id: createId() })}
              onRemove={removeTemplate}
              onQuickAdd={handleQuickAddTemplate}
            />
          </div>

          <div className="mt-6 border-t border-black/5 pt-5 dark:border-white/5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">최근 6개월 추이</h3>
            <HouseholdBudgetTrendChart trend={trend} />
          </div>

          <div className="mt-6 border-t border-black/5 pt-5 dark:border-white/5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">카테고리별 예산</h3>
            <HouseholdBudgetGoals
              monthEntries={monthEntries}
              goals={goals}
              onSetGoal={setBudgetGoal}
              onRemoveGoal={removeBudgetGoal}
            />
          </div>

          <div className="mt-6 border-t border-black/5 pt-5 dark:border-white/5">
            <h3 className="mb-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">데이터 저장(백업)</h3>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
              지금까지 입력한 모든 내역을 CSV 파일로 저장하거나, 저장해둔 CSV 파일을 다시 불러올 수 있습니다.
            </p>
            <HouseholdBudgetCsvTools entries={entries} onImport={handleCsvImport} />
          </div>
        </div>
      )}
    </div>
  );
}
