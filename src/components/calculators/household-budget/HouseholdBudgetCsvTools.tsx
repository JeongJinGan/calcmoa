"use client";

import { useRef, useState } from "react";
import { BudgetEntry } from "@/lib/calculators/householdBudget";
import { entriesToCsv, parseBudgetCsv } from "@/lib/calculators/householdBudgetCsv";

interface HouseholdBudgetCsvToolsProps {
  entries: BudgetEntry[];
  onImport: (entries: Omit<BudgetEntry, "id">[]) => void;
}

export default function HouseholdBudgetCsvTools({ entries, onImport }: HouseholdBudgetCsvToolsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  const handleExport = () => {
    const csv = entriesToCsv(entries);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `가계부_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    const { entries: parsed, skipped } = parseBudgetCsv(text);
    onImport(parsed);
    setStatus(
      parsed.length === 0
        ? "가져올 수 있는 내역이 없습니다. CSV 형식을 확인해주세요."
        : `${parsed.length}건 추가됨${skipped > 0 ? `, ${skipped}건 형식 오류로 건너뜀` : ""}`
    );
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={entries.length === 0}
          className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-neutral-300"
        >
          CSV 내보내기
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:text-neutral-300"
        >
          CSV 가져오기
        </button>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
      </div>
      {status && <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{status}</p>}
    </div>
  );
}
