import { calculateAge } from "@/lib/calculators/age";

export type InsuredPeriod = "under1" | "1to3" | "3to5" | "5to10" | "over10";

export interface UnemploymentBenefitInput {
  birthDate: string;
  leaveDate: string;
  insuredPeriod: InsuredPeriod;
  recentThreeMonthsPay: number;
}

export interface UnemploymentBenefitResult {
  ageAtLeave: number;
  averageDailyWage: number;
  dailyBenefit: number;
  prescribedDays: number;
  totalBenefit: number;
  isCapped: boolean;
  isFloored: boolean;
}

const DAILY_UPPER_LIMIT = 66_000;
const DAILY_LOWER_LIMIT = 64_192;

const PRESCRIBED_DAYS: Record<InsuredPeriod, { under50: number; over50: number }> = {
  under1: { under50: 120, over50: 120 },
  "1to3": { under50: 150, over50: 180 },
  "3to5": { under50: 180, over50: 210 },
  "5to10": { under50: 210, over50: 240 },
  over10: { under50: 240, over50: 270 },
};

function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateUnemploymentBenefit(input: UnemploymentBenefitInput): UnemploymentBenefitResult | null {
  const { birthDate, leaveDate, insuredPeriod, recentThreeMonthsPay } = input;
  if (!birthDate || !leaveDate || recentThreeMonthsPay <= 0) return null;

  const age = calculateAge({ birthDate, referenceDate: leaveDate });
  if (!age) return null;

  const leave = new Date(leaveDate);
  const threeMonthsAgo = new Date(leave);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const periodDays = Math.max(daysBetween(threeMonthsAgo, leave), 1);

  const averageDailyWage = recentThreeMonthsPay / periodDays;
  const rawDailyBenefit = averageDailyWage * 0.6;

  let dailyBenefit = rawDailyBenefit;
  let isCapped = false;
  let isFloored = false;

  if (dailyBenefit > DAILY_UPPER_LIMIT) {
    dailyBenefit = DAILY_UPPER_LIMIT;
    isCapped = true;
  } else if (dailyBenefit < DAILY_LOWER_LIMIT) {
    dailyBenefit = DAILY_LOWER_LIMIT;
    isFloored = true;
  }

  const bucket = PRESCRIBED_DAYS[insuredPeriod];
  const prescribedDays = age.internationalAge >= 50 ? bucket.over50 : bucket.under50;

  return {
    ageAtLeave: age.internationalAge,
    averageDailyWage,
    dailyBenefit,
    prescribedDays,
    totalBenefit: dailyBenefit * prescribedDays,
    isCapped,
    isFloored,
  };
}
