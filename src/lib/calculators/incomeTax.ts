import { findBracket, progressiveIncomeTax } from "@/lib/taxBrackets";

export interface IncomeTaxInput {
  totalIncome: number;
  deductions: number;
}

export interface IncomeTaxResult {
  taxBase: number;
  calculatedTax: number;
  localIncomeTax: number;
  totalTax: number;
  marginalRatePercent: number;
  effectiveRatePercent: number;
  afterTaxIncome: number;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult | null {
  const { totalIncome, deductions } = input;
  if (totalIncome <= 0) return null;

  const taxBase = Math.max(totalIncome - deductions, 0);
  const calculatedTax = progressiveIncomeTax(taxBase);
  const localIncomeTax = calculatedTax * 0.1;
  const totalTax = calculatedTax + localIncomeTax;
  const bracket = findBracket(taxBase);

  return {
    taxBase,
    calculatedTax,
    localIncomeTax,
    totalTax,
    marginalRatePercent: bracket.rate * 100,
    effectiveRatePercent: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
    afterTaxIncome: totalIncome - totalTax,
  };
}
