import { Transfer } from '@/domains/transfer';

describe('Transfer', () => {
  it('should create a transfer with the correct properties', () => {
    const id = 1;
    const companyId = 101;
    const amount = 1000;
    const debitAccount = '1234567890';
    const creditAccount = '0987654321';
    const transferDate = new Date('2025-03-18');

    const transfer = new Transfer(
      id,
      companyId,
      amount,
      debitAccount,
      creditAccount,
      transferDate,
    );

    expect(transfer.id).toBe(id);
    expect(transfer.companyId).toBe(companyId);
    expect(transfer.amount).toBe(amount);
    expect(transfer.debitAccount).toBe(debitAccount);
    expect(transfer.creditAccount).toBe(creditAccount);
    expect(transfer.transferDate).toBe(transferDate);
  });
});
