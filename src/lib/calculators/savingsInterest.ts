export type SavingsMode = "lumpSum" | "installment";
export type TaxOption = "general" | "preferential" | "taxFree";

export interface SavingsInterestInput {
  mode: SavingsMode;
  amount: number;
  annualRatePercent: number;
  months: number;
  taxOption: TaxOption;
}

export interface SavingsInterestResult {
  principal: number;
  grossInterest: number;
  tax: number;
  netInterest: number;
  maturityAmount: number;
}

const TAX_RATES: Record<TaxOption, number> = {
  general: 0.154,
  preferential: 0.095,
  taxFree: 0,
};

export function calculateSavingsInterest(input: SavingsInterestInput): SavingsInterestResult | null {
  const { mode, amount, annualRatePercent, months, taxOption } = input;
  if (amount <= 0 || months <= 0) return null;

  const rate = annualRatePercent / 100;
  let principal: number;
  let grossInterest: number;

  if (mode === "lumpSum") {
    principal = amount;
    grossInterest = principal * rate * (months / 12);
  } else {
    principal = amount * months;
    grossInterest = amount * ((months * (months + 1)) / 2) * (rate / 12);
  }

  const taxRate = TAX_RATES[taxOption];
  const tax = grossInterest * taxRate;
  const netInterest = grossInterest - tax;

  return {
    principal,
    grossInterest,
    tax,
    netInterest,
    maturityAmount: principal + netInterest,
  };
}
