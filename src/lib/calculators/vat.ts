export type VatMode = "fromSupply" | "fromTotal";

export interface VatResult {
  supplyAmount: number;
  vatAmount: number;
  totalAmount: number;
}

const VAT_RATE = 0.1;

export function calculateVat(amount: number, mode: VatMode): VatResult | null {
  if (amount <= 0) return null;

  if (mode === "fromSupply") {
    const vatAmount = amount * VAT_RATE;
    return { supplyAmount: amount, vatAmount, totalAmount: amount + vatAmount };
  }

  const supplyAmount = amount / (1 + VAT_RATE);
  const vatAmount = amount - supplyAmount;
  return { supplyAmount, vatAmount, totalAmount: amount };
}
