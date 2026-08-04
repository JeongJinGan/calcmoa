export interface BreakEvenResult {
  contributionMargin: number;
  contributionMarginRate: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
}

export function calculateBreakEven(
  fixedCost: number,
  variableCostPerUnit: number,
  pricePerUnit: number
): BreakEvenResult | null {
  if (fixedCost <= 0 || variableCostPerUnit < 0 || pricePerUnit <= 0) return null;

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) return null;

  const contributionMarginRate = (contributionMargin / pricePerUnit) * 100;
  const breakEvenUnits = fixedCost / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  return { contributionMargin, contributionMarginRate, breakEvenUnits, breakEvenRevenue };
}
