import { Test, TestingModule } from '@nestjs/testing';
import { GetNewAffiliatesService } from '@/application/services/company/get-new-affiliates.service';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';

describe('GetNewAffiliatesService', () => {
  let service: GetNewAffiliatesService;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(async () => {
    mockCompanyRepository = {
      getNewAffiliatesRaw: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNewAffiliatesService,
        { provide: CompanyRepository, useValue: mockCompanyRepository },
      ],
    }).compile();

    service = module.get<GetNewAffiliatesService>(GetNewAffiliatesService);
  });

  it('should return new affiliates from the last month', async () => {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 1);
    dateLimit.setUTCHours(0, 0, 0, 0);

    const mockCompanies = [
      {
        id: 1,
        cuit: '20123456789',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        transfers: [],
      },
      {
        id: 2,
        cuit: '20987654321',
        businessName: 'Another Company',
        adhesionDate: new Date(),
        transfers: [],
      },
    ];

    const mockTotal = 2;

    mockCompanyRepository.getNewAffiliatesRaw.mockResolvedValue({
      companies: mockCompanies,
      total: mockTotal,
    });

    const result = await service.execute(10, 0);

    expect(mockCompanyRepository.getNewAffiliatesRaw).toHaveBeenCalledWith(
      dateLimit,
      10,
      0,
    );

    expect(result).toEqual({
      data: [
        new Company(
          mockCompanies[0].id,
          mockCompanies[0].cuit,
          mockCompanies[0].businessName,
          mockCompanies[0].adhesionDate,
        ),
        new Company(
          mockCompanies[1].id,
          mockCompanies[1].cuit,
          mockCompanies[1].businessName,
          mockCompanies[1].adhesionDate,
        ),
      ],
      total: mockTotal,
      limit: 10,
      offset: 0,
    });
  });
});
