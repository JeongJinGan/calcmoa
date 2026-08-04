"use client";

import { useMemo, useState } from "react";
import { calculateSalary } from "@/lib/calculators/salary";
import { formatWon } from "@/lib/format";
import AmountInput from "@/components/ui/AmountInput";

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState("40000000");
  const [monthlyNonTaxable, setMonthlyNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState("1");
  const [childrenUnder20, setChildrenUnder20] = useState("0");

  const result = useMemo(() => {
    const salary = Number(annualSalary) || 0;
    if (salary <= 0) return null;
    return calculateSalary({
      annualSalary: salary,
      monthlyNonTaxable: Number(monthlyNonTaxable) || 0,
      dependents: Number(dependents) || 1,
      childrenUnder20: Number(childrenUnder20) || 0,
    });
  }, [annualSalary, monthlyNonTaxable, dependents, childrenUnder20]);

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">연봉 (세전, 원)</span>
          <AmountInput
            value={annualSalary}
            onChange={setAnnualSalary}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right text-lg font-semibold outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            placeholder="예: 40,000,000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">비과세액 (월, 원)</span>
          <AmountInput
            value={monthlyNonTaxable}
            onChange={setMonthlyNonTaxable}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
            placeholder="식대 등, 예: 200,000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">부양가족 수 (본인 포함)</span>
          <input
            type="number"
            inputMode="numeric"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">20세 이하 자녀 수</span>
          <input
            type="number"
            inputMode="numeric"
            value={childrenUnder20}
            onChange={(e) => setChildrenUnder20(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">예상 월 실수령액</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            {formatWon(result.monthlyNet)}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
            연 실수령액 약 {formatWon(result.annualNet)}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">월 급여(세전)</span>
            <span className="text-right font-medium">{formatWon(result.monthlyGross)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">국민연금</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.nationalPension)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">건강보험</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.healthInsurance)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">장기요양보험</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.longTermCare)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">고용보험</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.employmentInsurance)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">소득세</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.incomeTax)}</span>
            <span className="text-neutral-600 dark:text-neutral-400">지방소득세</span>
            <span className="text-right font-medium text-red-500">-{formatWon(result.localIncomeTax)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
