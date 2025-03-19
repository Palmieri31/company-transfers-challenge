import { Company } from '@/domains/company';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';

export abstract class CompanyRepository {
  abstract getNewAffiliates(
    limit: number,
    offset: number,
  ): Promise<{ data: Company[]; total: number; limit: number; offset: number }>;
  abstract createCompany(company: Company): Promise<Company>;
  abstract getCompaniesWithTransfersLastMonth(
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<CompanyWithTransfersDto>>;
  abstract findById(id: number): Promise<Company>;
  abstract findByCuit(cuit: string): Promise<Company>;
}
