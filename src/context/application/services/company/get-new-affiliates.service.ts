import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';

@Injectable()
export class GetNewAffiliatesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(
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

    const { companies, total } =
      await this.companyRepository.getNewAffiliatesRaw(
        dateLimit,
        limit,
        offset,
      );

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
}
