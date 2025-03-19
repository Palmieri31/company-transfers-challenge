import { ConflictException, Injectable } from '@nestjs/common';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';

@Injectable()
export class CreateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(cuit: string, businessName: string): Promise<Company> {
    const existingCompany = await this.companyRepository.findByCuit(cuit);
    if (existingCompany) {
      throw new ConflictException('A company with this CUIT already exists.');
    }

    const company = new Company(0, cuit, businessName, new Date());
    return this.companyRepository.createCompany(company);
  }
}
