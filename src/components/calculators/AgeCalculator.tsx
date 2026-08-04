"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateAge } from "@/lib/calculators/age";

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [referenceDate, setReferenceDate] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the client's local clock, unavailable during SSG
    setReferenceDate(todayString());
  }, []);

  const result = useMemo(() => calculateAge({ birthDate, referenceDate }), [birthDate, referenceDate]);

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">생년월일</span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">기준일</span>
          <input
            type="date"
            value={referenceDate}
            onChange={(e) => setReferenceDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-white/10 dark:bg-neutral-800"
          />
        </label>
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-500/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">만 나이</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-700 dark:text-blue-400">{result.internationalAge}세</p>

          <div className="mt-5 grid grid-cols-2 gap-y-2 border-t border-blue-200/60 pt-4 text-sm dark:border-blue-900/40">
            <span className="text-neutral-600 dark:text-neutral-400">연 나이</span>
            <span className="text-right font-medium">{result.yearAge}세</span>
            <span className="text-neutral-600 dark:text-neutral-400">세는 나이(한국식)</span>
            <span className="text-right font-medium">{result.koreanCountingAge}세</span>
            <span className="text-neutral-600 dark:text-neutral-400">다음 생일까지</span>
            <span className="text-right font-medium">
              {result.daysUntilNextBirthday === 0 ? "오늘 생일 🎉" : `${result.daysUntilNextBirthday}일 (${result.nextBirthday})`}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-red-500">생년월일은 기준일보다 이전이어야 합니다.</p>
      )}
    </div>
  );
}
