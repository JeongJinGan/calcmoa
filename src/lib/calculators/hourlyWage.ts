export interface HourlyWageResult {
  isHolidayPayEligible: boolean;
  weeklyHolidayPay: number;
  weeklyBasePay: number;
  weeklyTotalPay: number;
  monthlyTotalPay: number;
  effectiveHourlyRate: number;
}

const WEEKS_PER_MONTH = 365 / 7 / 12;

export function calculateHourlyWage(hourlyWage: number, weeklyHours: number): HourlyWageResult | null {
  if (hourlyWage <= 0 || weeklyHours <= 0) return null;

  const isHolidayPayEligible = weeklyHours >= 15;
  const cappedHours = Math.min(weeklyHours, 40);
  const weeklyHolidayPay = isHolidayPayEligible ? (cappedHours / 40) * 8 * hourlyWage : 0;

  const weeklyBasePay = hourlyWage * weeklyHours;
  const weeklyTotalPay = weeklyBasePay + weeklyHolidayPay;
  const monthlyTotalPay = weeklyTotalPay * WEEKS_PER_MONTH;
  const effectiveHourlyRate = weeklyTotalPay / weeklyHours;

  return {
    isHolidayPayEligible,
    weeklyHolidayPay,
    weeklyBasePay,
    weeklyTotalPay,
    monthlyTotalPay,
    effectiveHourlyRate,
  };
}
