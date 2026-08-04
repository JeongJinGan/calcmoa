import { BudgetEntry } from "@/lib/calculators/householdBudget";

const CSV_HEADER = "날짜,구분,카테고리,금액,메모";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function entriesToCsv(entries: BudgetEntry[]): string {
  const rows = entries
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) =>
      [
        entry.date,
        entry.type === "income" ? "수입" : "지출",
        escapeCsvField(entry.category),
        String(entry.amount),
        escapeCsvField(entry.memo),
      ].join(",")
    );

  return [CSV_HEADER, ...rows].join("\n");
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

export interface CsvParseResult {
  entries: Omit<BudgetEntry, "id">[];
  skipped: number;
}

export function parseBudgetCsv(text: string): CsvParseResult {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const dataLines = lines[0]?.startsWith("날짜") ? lines.slice(1) : lines;

  const entries: Omit<BudgetEntry, "id">[] = [];
  let skipped = 0;

  for (const line of dataLines) {
    const [date, typeLabel, category, amountText, memo = ""] = parseCsvLine(line);
    const type = typeLabel === "수입" ? "income" : typeLabel === "지출" ? "expense" : null;
    const amount = Number(amountText);

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !type || !category || !Number.isFinite(amount) || amount <= 0) {
      skipped++;
      continue;
    }

    entries.push({ date, type, category, amount, memo });
  }

  return { entries, skipped };
}
