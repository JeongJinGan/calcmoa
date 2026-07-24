export interface SeveranceInput {
  hireDate: string;
  resignDate: string;
  recentThreeMonthsPay: number;
  annualBonus: number;
  annualLeaveAllowance: number;
}

export interface SeveranceResult {
  workedDays: number;
  workedYears: number;
  periodDays: number;
  averageDailyWage: number;
  severancePay: number;
  isEligible: boolean;
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function calculateSeverance(input: SeveranceInput): SeveranceResult | null {
  const { hireDate, resignDate, recentThreeMonthsPay, annualBonus, annualLeaveAllowance } = input;
  if (!hireDate || !resignDate) return null;

  const hire = new Date(hireDate);
  const resign = new Date(resignDate);
  if (Number.isNaN(hire.getTime()) || Number.isNaN(resign.getTime()) || resign <= hire) return null;

  const workedDays = daysBetween(hire, resign) + 1;
  const isEligible = workedDays >= 365;

  const threeMonthsAgo = new Date(resign);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const periodDays = Math.max(daysBetween(threeMonthsAgo, resign), 1);

  const bonusPortion = annualBonus * (3 / 12);
  const leavePortion = annualLeaveAllowance * (3 / 12);
  const averageDailyWage = (recentThreeMonthsPay + bonusPortion + leavePortion) / periodDays;

  const severancePay = averageDailyWage * 30 * (workedDays / 365);

  return {
    workedDays,
    workedYears: workedDays / 365,
    periodDays,
    averageDailyWage,
    severancePay: isEligible ? severancePay : 0,
    isEligible,
  };
}
