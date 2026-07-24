import { progressiveIncomeTax } from "@/lib/taxBrackets";

export interface SalaryInput {
  annualSalary: number;
  monthlyNonTaxable: number;
  dependents: number;
  childrenUnder20: number;
}

export interface SalaryResult {
  monthlyGross: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  totalInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;
  monthlyNet: number;
  annualNet: number;
}

const NP_RATE = 0.045;
const NP_CAP_BASE_MONTHLY = 6_370_000;
const NP_FLOOR_BASE_MONTHLY = 390_000;
const HEALTH_RATE = 0.03545;
const LONGTERM_RATE_OF_HEALTH = 0.1295;
const EI_RATE = 0.009;

function earnedIncomeDeduction(grossAnnual: number): number {
  if (grossAnnual <= 5_000_000) return grossAnnual * 0.7;
  if (grossAnnual <= 15_000_000) return 3_500_000 + (grossAnnual - 5_000_000) * 0.4;
  if (grossAnnual <= 45_000_000) return 7_500_000 + (grossAnnual - 15_000_000) * 0.15;
  if (grossAnnual <= 100_000_000) return 12_000_000 + (grossAnnual - 45_000_000) * 0.05;
  return 14_750_000 + (grossAnnual - 100_000_000) * 0.02;
}

function earnedIncomeTaxCredit(calculatedTax: number, grossAnnual: number): number {
  const raw = calculatedTax <= 1_300_000 ? calculatedTax * 0.55 : 1_300_000 * 0.55 + (calculatedTax - 1_300_000) * 0.3;
  let cap: number;
  if (grossAnnual <= 33_000_000) cap = 740_000;
  else if (grossAnnual <= 70_000_000) cap = Math.max(660_000, 740_000 - (grossAnnual - 33_000_000) * 0.008);
  else cap = Math.max(500_000, 660_000 - (grossAnnual - 70_000_000) * 0.5);
  return Math.min(raw, cap);
}

function childTaxCredit(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 150_000;
  if (count === 2) return 350_000;
  return 350_000 + (count - 2) * 300_000;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { annualSalary, monthlyNonTaxable, dependents, childrenUnder20 } = input;
  const monthlyGross = annualSalary / 12;
  const insuranceBaseMonthly = Math.min(
    Math.max(monthlyGross - monthlyNonTaxable, 0),
    NP_CAP_BASE_MONTHLY,
  );
  const npBase = Math.max(insuranceBaseMonthly, Math.min(NP_FLOOR_BASE_MONTHLY, insuranceBaseMonthly));
  const healthBaseMonthly = Math.max(monthlyGross - monthlyNonTaxable, 0);

  const nationalPension = Math.round(npBase * NP_RATE);
  const healthInsurance = Math.round(healthBaseMonthly * HEALTH_RATE);
  const longTermCare = Math.round(healthInsurance * LONGTERM_RATE_OF_HEALTH);
  const employmentInsurance = Math.round(healthBaseMonthly * EI_RATE);
  const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  const taxableGrossAnnual = Math.max(annualSalary - monthlyNonTaxable * 12, 0);
  const deduction = earnedIncomeDeduction(taxableGrossAnnual);
  const earnedIncomeAmount = Math.max(taxableGrossAnnual - deduction, 0);
  const personalDeduction = Math.max(dependents, 1) * 1_500_000;
  const insuranceDeductionAnnual = totalInsurance * 12;
  const taxBase = Math.max(earnedIncomeAmount - personalDeduction - insuranceDeductionAnnual, 0);

  const calculatedTax = progressiveIncomeTax(taxBase);
  const earnedCredit = earnedIncomeTaxCredit(calculatedTax, taxableGrossAnnual);
  const childCredit = childTaxCredit(childrenUnder20);
  const annualIncomeTax = Math.max(calculatedTax - earnedCredit - childCredit, 0);
  const annualLocalTax = annualIncomeTax * 0.1;

  const incomeTax = Math.round(annualIncomeTax / 12);
  const localIncomeTax = Math.round(annualLocalTax / 12);
  const totalTax = incomeTax + localIncomeTax;

  const monthlyNet = monthlyGross - totalInsurance - totalTax;

  return {
    monthlyGross,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    totalInsurance,
    incomeTax,
    localIncomeTax,
    totalTax,
    monthlyNet,
    annualNet: monthlyNet * 12,
  };
}
