export interface TaxBracket {
  limit: number;
  rate: number;
  deduction: number;
}

export const INCOME_TAX_BRACKETS_2025: TaxBracket[] = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
];

export function findBracket(taxBase: number): TaxBracket {
  return (
    INCOME_TAX_BRACKETS_2025.find((b) => taxBase <= b.limit) ??
    INCOME_TAX_BRACKETS_2025[INCOME_TAX_BRACKETS_2025.length - 1]
  );
}

export function progressiveIncomeTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const bracket = findBracket(taxBase);
  return Math.max(0, taxBase * bracket.rate - bracket.deduction);
}
