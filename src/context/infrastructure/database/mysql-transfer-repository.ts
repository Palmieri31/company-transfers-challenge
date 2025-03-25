import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransferRepository } from '@/application/ports/transfer-repository.port';
import { TransferEntity } from './entities/transfer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from '@/domains/transfer';

@Injectable()
export class TransferRepositoryImpl implements TransferRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly repository: Repository<TransferEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransfer(transfer: Transfer): Promise<Transfer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = new TransferEntity();
      entity.companyId = transfer.companyId;
      entity.amount = transfer.amount;
      entity.debitAccount = transfer.debitAccount;
      entity.creditAccount = transfer.creditAccount;
      entity.transferDate = transfer.transferDate;

      const savedEntity = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
      return new Transfer(
        savedEntity.id,
        savedEntity.companyId,
        savedEntity.amount,
        savedEntity.debitAccount,
        savedEntity.creditAccount,
        savedEntity.transferDate,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
