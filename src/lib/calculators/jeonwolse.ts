export type JeonwolseMode = "jeonseToWolse" | "wolseToJeonse";

export interface JeonwolseResult {
  jeonseDeposit: number;
  wolseDeposit: number;
  monthlyRent: number;
  conversionRate: number;
}

export function calculateJeonwolse(
  mode: JeonwolseMode,
  wolseDeposit: number,
  conversionRate: number,
  target: number
): JeonwolseResult | null {
  if (wolseDeposit < 0 || conversionRate <= 0) return null;

  if (mode === "jeonseToWolse") {
    const jeonseDeposit = target;
    if (jeonseDeposit <= wolseDeposit) return null;

    const monthlyRent = ((jeonseDeposit - wolseDeposit) * (conversionRate / 100)) / 12;
    return { jeonseDeposit, wolseDeposit, monthlyRent, conversionRate };
  }

  const monthlyRent = target;
  if (monthlyRent <= 0) return null;

  const jeonseDeposit = wolseDeposit + (monthlyRent * 12) / (conversionRate / 100);
  return { jeonseDeposit, wolseDeposit, monthlyRent, conversionRate };
}
