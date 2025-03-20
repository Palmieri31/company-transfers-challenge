import { Injectable, NotFoundException } from '@nestjs/common';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { CompanyEntity } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '@/domains/company';
import { TransferEntity } from './entities/transfer.entity';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repository: Repository<CompanyEntity>,
    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,
  ) {}

  async createCompany(company: Company): Promise<Company> {
    const entity = new CompanyEntity();
    entity.cuit = company.cuit;
    entity.businessName = company.businessName;
    entity.adhesionDate = company.adhesionDate;
    const savedEntity = await this.repository.save(entity);
    return new Company(
      savedEntity.id,
      savedEntity.cuit,
      savedEntity.businessName,
      savedEntity.adhesionDate,
    );
  }

  async getNewAffiliatesRaw(
    dateLimit: Date,
    limit: number,
    offset: number,
  ): Promise<{ companies: CompanyEntity[]; total: number }> {
    const total = await this.repository.count({
      where: { adhesionDate: MoreThanOrEqual(dateLimit) },
    });

    const companies = await this.repository.find({
      where: { adhesionDate: MoreThanOrEqual(dateLimit) },
      take: limit,
      skip: offset,
    });

    return { companies, total };
  }

  async getCompaniesWithTransfersLastMonthRaw(
    dateLimit: Date,
  ): Promise<{ companyIds: number[] }> {
    const transfers = await this.transferRepository.find({
      where: { transferDate: MoreThanOrEqual(dateLimit) },
      relations: ['company'],
    });

    const companyIds = Array.from(
      new Set(transfers.map((transfer) => transfer.company.id)),
    );

    return { companyIds };
  }

  async getCompaniesByIds(
    companyIds: number[],
    limit: number,
    offset: number,
  ): Promise<CompanyEntity[]> {
    return this.repository.find({
      where: { id: In(companyIds) },
      take: limit,
      skip: offset,
      relations: ['transfers'],
    });
  }

  async findById(id: number): Promise<Company> {
    const companyEntity = await this.repository.findOne({ where: { id } });
    if (!companyEntity) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return new Company(
      companyEntity.id,
      companyEntity.cuit,
      companyEntity.businessName,
      companyEntity.adhesionDate,
    );
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    const companyEntity = await this.repository.findOne({ where: { cuit } });
    if (!companyEntity) {
      return null;
    }

    return new Company(
      companyEntity.id,
      companyEntity.cuit,
      companyEntity.businessName,
      companyEntity.adhesionDate,
    );
  }
}
