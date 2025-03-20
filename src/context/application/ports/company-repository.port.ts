import { Company } from '@/domains/company';
import { CompanyEntity } from '@/infrastructure/database/entities/company.entity';

export abstract class CompanyRepository {
  abstract getNewAffiliatesRaw(
    dateLimit: Date,
    limit: number,
    offset: number,
  ): Promise<{ companies: CompanyEntity[]; total: number }>;
  abstract createCompany(company: Company): Promise<Company>;
  abstract findById(id: number): Promise<Company>;
  abstract findByCuit(cuit: string): Promise<Company>;
  abstract getCompaniesWithTransfersLastMonthRaw(
    dateLimit: Date,
  ): Promise<{ companyIds: number[] }>;
  abstract getCompaniesByIds(
    companyIds: number[],
    limit: number,
    offset: number,
  ): Promise<CompanyEntity[]>;
}
