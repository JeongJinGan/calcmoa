export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString("ko-KR");
}

export function formatWon(value: number): string {
  return `${formatNumber(value)}원`;
}

export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toManwon(value: number): number {
  return value / 10000;
}
