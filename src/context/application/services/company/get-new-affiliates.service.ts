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
    return this.companyRepository.getNewAffiliates(limit, offset);
  }
}
