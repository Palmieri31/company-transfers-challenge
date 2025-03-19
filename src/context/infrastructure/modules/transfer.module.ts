import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferEntity } from '../database/entities/transfer.entity';
import { CreateTransferService } from '@/application/services/transfer/create-transfer.service';
import { TransferRepositoryImpl } from '../database/mysql-transfer-repository';
import { TransferRepository } from '@/application/ports/transfer-repository.port';
import { TransferController } from '../controllers/transfer.controller';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { CompanyRepositoryImpl } from '../database/mysql-company-repository';
import { CompanyEntity } from '../database/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransferEntity, CompanyEntity])],
  providers: [
    CreateTransferService,
    TransferRepositoryImpl,
    CompanyRepositoryImpl,
    {
      provide: TransferRepository,
      useExisting: TransferRepositoryImpl,
    },
    {
      provide: CompanyRepository,
      useExisting: CompanyRepositoryImpl,
    },
  ],
  controllers: [TransferController],
  exports: [CreateTransferService],
})
export class TransferModule {}
