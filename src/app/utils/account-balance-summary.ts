import { Account } from '../models/models';

export interface CurrencyBalanceSummary {
  currency: string;
  balance: number;
}

export function summarizeAccountBalances(accounts: readonly Account[]): CurrencyBalanceSummary[] {
  const centsByCurrency = new Map<string, number>();

  for (const account of accounts) {
    const currency = account.currency?.trim().toUpperCase() || '???';
    const balanceInCents = Math.round(Number(account.balance || 0) * 100);
    centsByCurrency.set(currency, (centsByCurrency.get(currency) ?? 0) + balanceInCents);
  }

  return Array.from(centsByCurrency, ([currency, cents]) => ({
    currency,
    balance: cents / 100,
  })).sort((left, right) => left.currency.localeCompare(right.currency));
}