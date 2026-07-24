export type RepaymentType = "equalPayment" | "equalPrincipal" | "bullet";

export interface LoanInput {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  type: RepaymentType;
}

export interface LoanScheduleRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanResult {
  schedule: LoanScheduleRow[];
  totalPayment: number;
  totalInterest: number;
  firstMonthPayment: number;
}

export function calculateLoan(input: LoanInput): LoanResult | null {
  const { principal, annualRatePercent, termMonths, type } = input;
  if (principal <= 0 || termMonths <= 0) return null;

  const monthlyRate = annualRatePercent / 100 / 12;
  const schedule: LoanScheduleRow[] = [];
  let remaining = principal;

  if (type === "equalPayment") {
    const payment =
      monthlyRate === 0
        ? principal / termMonths
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

    for (let month = 1; month <= termMonths; month++) {
      const interestPaid = remaining * monthlyRate;
      let principalPaid = payment - interestPaid;
      if (month === termMonths) principalPaid = remaining;
      remaining = Math.max(remaining - principalPaid, 0);
      schedule.push({
        month,
        payment: principalPaid + interestPaid,
        principalPaid,
        interestPaid,
        remainingBalance: remaining,
      });
    }
  } else if (type === "equalPrincipal") {
    const principalPayment = principal / termMonths;
    for (let month = 1; month <= termMonths; month++) {
      const interestPaid = remaining * monthlyRate;
      remaining = Math.max(remaining - principalPayment, 0);
      schedule.push({
        month,
        payment: principalPayment + interestPaid,
        principalPaid: principalPayment,
        interestPaid,
        remainingBalance: remaining,
      });
    }
  } else {
    for (let month = 1; month <= termMonths; month++) {
      const interestPaid = remaining * monthlyRate;
      const principalPaid = month === termMonths ? remaining : 0;
      if (month === termMonths) remaining = 0;
      schedule.push({
        month,
        payment: principalPaid + interestPaid,
        principalPaid,
        interestPaid,
        remainingBalance: remaining,
      });
    }
  }

  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interestPaid, 0);

  return {
    schedule,
    totalPayment,
    totalInterest,
    firstMonthPayment: schedule[0]?.payment ?? 0,
  };
}
