export type OvertimeInputMode = "hourly" | "monthly";

export const STANDARD_MONTHLY_HOURS = 209;

export function monthlyToHourlyWage(monthlySalary: number): number {
  return monthlySalary / STANDARD_MONTHLY_HOURS;
}

export interface OvertimePayResult {
  hourlyWage: number;
  overtimeHourlyRate: number;
  overtimePay: number;
  nightHourlyRate: number;
  nightPay: number;
  totalExtraPay: number;
}

export function calculateOvertimePay(
  hourlyWage: number,
  overtimeHours: number,
  nightHours: number
): OvertimePayResult | null {
  if (hourlyWage <= 0 || overtimeHours < 0 || nightHours < 0) return null;

  const overtimeHourlyRate = hourlyWage * 1.5;
  const overtimePay = overtimeHourlyRate * overtimeHours;
  const nightHourlyRate = hourlyWage * 0.5;
  const nightPay = nightHourlyRate * nightHours;

  return {
    hourlyWage,
    overtimeHourlyRate,
    overtimePay,
    nightHourlyRate,
    nightPay,
    totalExtraPay: overtimePay + nightPay,
  };
}
