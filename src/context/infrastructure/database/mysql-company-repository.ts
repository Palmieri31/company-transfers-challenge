import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { CompanyEntity } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '@/domains/company';
import { TransferEntity } from './entities/transfer.entity';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repository: Repository<CompanyEntity>,
    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,
  ) {}

  async createCompany(company: Company): Promise<Company> {
    const existingCompany = await this.repository.findOne({
      where: { cuit: company.cuit },
    });
    if (existingCompany) {
      throw new ConflictException('A company with this CUIT already exists.');
    }

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

  async getNewAffiliates(
    limit: number,
    offset: number,
  ): Promise<{
    data: Company[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);
    dateLimit.setUTCHours(0, 0, 0, 0);

    const total = await this.repository.count({
      where: { adhesionDate: MoreThanOrEqual(dateLimit) },
    });

    const companies = await this.repository.find({
      where: { adhesionDate: MoreThanOrEqual(dateLimit) },
      take: limit,
      skip: offset,
    });

    const data = companies.map(
      (company) =>
        new Company(
          company.id,
          company.cuit,
          company.businessName,
          company.adhesionDate,
        ),
    );

    return { data, total, limit, offset };
  }

  async getCompaniesWithTransfersLastMonth(
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<CompanyWithTransfersDto>> {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);
    dateLimit.setUTCHours(0, 0, 0, 0);

    const transfers = await this.transferRepository.find({
      where: { transferDate: MoreThanOrEqual(dateLimit) },
      relations: ['company'],
    });

    const companyIds = Array.from(
      new Set(transfers.map((transfer) => transfer.company.id)),
    );

    const total = companyIds.length;

    const companies = await this.repository.find({
      where: { id: In(companyIds) },
      take: limit,
      skip: offset,
      relations: ['transfers'],
    });

    const data = companies.map((company) => ({
      company: new Company(
        company.id,
        company.cuit,
        company.businessName,
        company.adhesionDate,
      ),
      transfers: company.transfers
        .filter((transfer) => new Date(transfer.transferDate) >= dateLimit)
        .map((transfer) => ({
          id: transfer.id,
          companyId: transfer.companyId,
          amount: transfer.amount,
          debitAccount: transfer.debitAccount,
          creditAccount: transfer.creditAccount,
          transferDate: transfer.transferDate,
        })),
    }));

    return { data, total, limit, offset };
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
