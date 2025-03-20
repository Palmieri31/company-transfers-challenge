import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';
import { Company } from '@/domains/company';

@Injectable()
export class CompaniesWithTransfersService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(
    limit: number,
    offset: number,
  ): Promise<PaginatedResponse<CompanyWithTransfersDto>> {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);
    dateLimit.setUTCHours(0, 0, 0, 0);

    const { companyIds } =
      await this.companyRepository.getCompaniesWithTransfersLastMonthRaw(
        dateLimit,
      );

    const total = companyIds.length;

    const companies = await this.companyRepository.getCompaniesByIds(
      companyIds,
      limit,
      offset,
    );

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
}
