export interface Payer {
  name: string;
  paid: number;
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export interface SettlementResult {
  totalAmount: number;
  share: number;
  transfers: Transfer[];
}

export function calculateEqualSplit(totalAmount: number, peopleCount: number): number | null {
  if (totalAmount <= 0 || peopleCount <= 0) return null;
  return totalAmount / peopleCount;
}

export function calculateSettlement(payers: Payer[]): SettlementResult | null {
  if (payers.length < 2 || payers.some((p) => p.paid < 0)) return null;

  const totalAmount = payers.reduce((sum, p) => sum + p.paid, 0);
  if (totalAmount <= 0) return null;

  const share = totalAmount / payers.length;
  const EPSILON = 1;

  const balances = payers.map((p) => ({ name: p.name, balance: p.paid - share }));
  const creditors = balances.filter((b) => b.balance > EPSILON).map((b) => ({ ...b }));
  const debtors = balances.filter((b) => b.balance < -EPSILON).map((b) => ({ ...b, balance: -b.balance }));

  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.balance, creditor.balance);

    if (amount > EPSILON) {
      transfers.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
    }

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance <= EPSILON) i++;
    if (creditor.balance <= EPSILON) j++;
  }

  return { totalAmount, share, transfers };
}
