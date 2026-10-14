import { summarizeAccountBalances } from './account-balance-summary';

describe('summarizeAccountBalances', () => {
  it('keeps amounts in different currencies separate', () => {
    const result = summarizeAccountBalances([
      { id: 1, balance: 5000, currency: 'USD' },
      { id: 2, balance: 15000, currency: 'USD' },
      { id: 3, balance: 3000, currency: 'EUR' },
      { id: 4, balance: 25000, currency: 'MAD' },
    ]);

    expect(result).toEqual([
      { currency: 'EUR', balance: 3000 },
      { currency: 'MAD', balance: 25000 },
      { currency: 'USD', balance: 20000 },
    ]);
  });

  it('sums using cents to avoid floating-point drift', () => {
    const result = summarizeAccountBalances([
      { id: 1, balance: 0.1, currency: 'EUR' },
      { id: 2, balance: 0.2, currency: 'eur' },
    ]);

    expect(result).toEqual([{ currency: 'EUR', balance: 0.3 }]);
  });
});