import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';

@Injectable()
export class CompaniesWithTransfersService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(
    limit: number,
    offset: number,
  ): Promise<Promise<PaginatedResponse<CompanyWithTransfersDto>>> {
    return this.companyRepository.getCompaniesWithTransfersLastMonth(
      limit,
      offset,
    );
  }
}
