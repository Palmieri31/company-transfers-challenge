import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransferRepository } from '@/application/ports/transfer-repository.port';
import { TransferEntity } from './entities/transfer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from '@/domains/transfer';

@Injectable()
export class TransferRepositoryImpl implements TransferRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly repository: Repository<TransferEntity>,
  ) {}

  async createTransfer(transfer: Transfer): Promise<Transfer> {
    const entity = new TransferEntity();
    entity.companyId = transfer.companyId;
    entity.amount = transfer.amount;
    entity.debitAccount = transfer.debitAccount;
    entity.creditAccount = transfer.creditAccount;
    entity.transferDate = transfer.transferDate;
    const savedEntity = await this.repository.save(entity);
    return new Transfer(
      savedEntity.id,
      savedEntity.companyId,
      savedEntity.amount,
      savedEntity.debitAccount,
      savedEntity.creditAccount,
      savedEntity.transferDate,
    );
  }
}
