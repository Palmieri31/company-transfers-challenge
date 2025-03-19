import { Transfer } from '@/domains/transfer';

export abstract class TransferRepository {
  abstract createTransfer(transfer: Transfer): Promise<Transfer>;
}
