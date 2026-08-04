"use client";

import { useState } from "react";
import { BudgetEntryType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/calculators/householdBudget";
import { RecurringTemplate } from "@/lib/calculators/householdBudgetStore";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

interface HouseholdBudgetTemplatesProps {
  templates: RecurringTemplate[];
  onAdd: (template: Omit<RecurringTemplate, "id">) => void;
  onRemove: (id: string) => void;
  onQuickAdd: (template: RecurringTemplate) => void;
}

export default function HouseholdBudgetTemplates({
  templates,
  onAdd,
  onRemove,
  onQuickAdd,
}: HouseholdBudgetTemplatesProps) {
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<BudgetEntryType>("expense");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (nextType: BudgetEntryType) => {
    setType(nextType);
    setCategory(nextType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSave = () => {
    const parsedAmount = Number(amount) || 0;
    if (!label.trim() || parsedAmount <= 0) return;

    onAdd({ label: label.trim(), type, category, amount: parsedAmount, memo: "" });
    setLabel("");
    setAmount("");
    setShowForm(false);
  };

  return (
    <div>
      {templates.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center gap-2 rounded-full border border-black/5 bg-neutral-50 py-1 pl-3 pr-1 text-xs transition-shadow hover:shadow-sm dark:border-white/5 dark:bg-neutral-800"
            >
              <button type="button" onClick={() => onQuickAdd(template)} className="flex items-center gap-1.5">
                <span
                  className={`font-medium ${
                    template.type === "income" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  +
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">{template.label}</span>
                <span className="text-neutral-400">{formatWon(template.amount)}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(template.id)}
                aria-label={`${template.label} 템플릿 삭제`}
                className="rounded-full px-1 text-neutral-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="space-y-3 rounded-2xl border border-black/5 bg-neutral-50/60 p-4 dark:border-white/5 dark:bg-neutral-800/30">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                type === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              지출
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                type === "income"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              수입
            </button>
          </div>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="템플릿 이름 (예: 월세)"
            className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-black/10 bg-neutral-50 px-2 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <AmountInput
              value={amount}
              onChange={setAmount}
              placeholder="금액"
              className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-blue-500 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              템플릿 저장
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border border-dashed border-black/15 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-white/15 dark:text-neutral-400"
        >
          + 고정 지출 템플릿 추가
        </button>
      )}
    </div>
  );
}
