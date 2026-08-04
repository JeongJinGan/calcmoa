export type CostPriceMode = "priceFromMargin" | "marginFromPrice";

export interface CostPriceResult {
  cost: number;
  sellingPrice: number;
  feeAmount: number;
  marginAmount: number;
  marginRate: number;
  costRate: number;
}

export function calculateCostPrice(
  mode: CostPriceMode,
  cost: number,
  feeRate: number,
  target: number
): CostPriceResult | null {
  if (cost <= 0 || feeRate < 0 || feeRate >= 100) return null;

  if (mode === "priceFromMargin") {
    const marginRate = target;
    if (marginRate < 0 || feeRate + marginRate >= 100) return null;

    const sellingPrice = cost / (1 - (feeRate + marginRate) / 100);
    const feeAmount = (sellingPrice * feeRate) / 100;
    const marginAmount = (sellingPrice * marginRate) / 100;
    const costRate = (cost / sellingPrice) * 100;

    return { cost, sellingPrice, feeAmount, marginAmount, marginRate, costRate };
  }

  const sellingPrice = target;
  if (sellingPrice <= 0) return null;

  const feeAmount = (sellingPrice * feeRate) / 100;
  const marginAmount = sellingPrice - cost - feeAmount;
  const marginRate = (marginAmount / sellingPrice) * 100;
  const costRate = (cost / sellingPrice) * 100;

  return { cost, sellingPrice, feeAmount, marginAmount, marginRate, costRate };
}
