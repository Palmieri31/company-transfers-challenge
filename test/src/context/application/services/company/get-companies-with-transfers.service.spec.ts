import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesWithTransfersService } from '@/application/services/company/get-companies-with-transfers.service';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';

describe('CompaniesWithTransfersService', () => {
  let service: CompaniesWithTransfersService;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    mockCompanyRepository = {
      getCompaniesWithTransfersLastMonthRaw: jest.fn(),
      getCompaniesByIds: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesWithTransfersService,
        { provide: CompanyRepository, useValue: mockCompanyRepository },
      ],
    }).compile();

    service = module.get<CompaniesWithTransfersService>(
      CompaniesWithTransfersService,
    );
  });

  it('should return companies with transfers from last month', async () => {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);
    dateLimit.setUTCHours(0, 0, 0, 0);

    const mockTransfers = [
      {
        id: 1,
        companyId: 1,
        amount: 1000,
        debitAccount: '1234567890',
        creditAccount: '0987654321',
        transferDate: new Date(),
        company: {
          id: 1,
          cuit: '20123456789',
          businessName: 'Test Company',
          adhesionDate: new Date(),
          transfers: [],
        },
      },
    ];

    const mockCompanies = [
      {
        id: 1,
        cuit: '20123456789',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        transfers: mockTransfers,
      },
    ];

    const mockCompanyIds = [1];

    mockCompanyRepository.getCompaniesWithTransfersLastMonthRaw.mockResolvedValue(
      { companyIds: mockCompanyIds },
    );
    mockCompanyRepository.getCompaniesByIds.mockResolvedValue(mockCompanies);

    const result: PaginatedResponse<CompanyWithTransfersDto> =
      await service.execute(10, 0);

    expect(
      mockCompanyRepository.getCompaniesWithTransfersLastMonthRaw,
    ).toHaveBeenCalledWith(dateLimit);
    expect(mockCompanyRepository.getCompaniesByIds).toHaveBeenCalledWith(
      mockCompanyIds,
      10,
      0,
    );

    expect(result).toEqual({
      data: [
        {
          company: new Company(
            mockCompanies[0].id,
            mockCompanies[0].cuit,
            mockCompanies[0].businessName,
            mockCompanies[0].adhesionDate,
          ),
          transfers: [
            {
              id: 1,
              companyId: 1,
              amount: 1000,
              debitAccount: '1234567890',
              creditAccount: '0987654321',
              transferDate: expect.any(Date),
            },
          ],
        },
      ],
      total: 1,
      limit: 10,
      offset: 0,
    });
  });
});
