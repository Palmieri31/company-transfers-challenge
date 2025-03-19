import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from '../controllers/company.controller';
import { CreateCompanyService } from '../../application/services/company/create-company.service';
import { CompanyRepositoryImpl } from '../database/mysql-company-repository';
import { CompanyEntity } from '../database/entities/company.entity';
import { CompanyRepository } from '../../application/ports/company-repository.port';
import { GetNewAffiliatesService } from '@/application/services/company/get-new-affiliates.service';
import { CompaniesWithTransfersService } from '@/application/services/company/get-companies-with-transfers.service';
import { TransferEntity } from '../database/entities/transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, TransferEntity])],
  providers: [
    CreateCompanyService,
    GetNewAffiliatesService,
    CompaniesWithTransfersService,
    CompanyRepositoryImpl,
    {
      provide: CompanyRepository,
      useExisting: CompanyRepositoryImpl,
    },
  ],
  controllers: [CompanyController],
  exports: [
    CreateCompanyService,
    GetNewAffiliatesService,
    CompaniesWithTransfersService,
  ],
})
export class CompanyModule {}
