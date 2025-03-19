import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '@/infrastructure/controllers/company.controller';
import { CreateCompanyService } from '@/application/services/company/create-company.service';
import { GetNewAffiliatesService } from '@/application/services/company/get-new-affiliates.service';
import { CompaniesWithTransfersService } from '@/application/services/company/get-companies-with-transfers.service';
import { Company } from '@/domains/company';
import { CreateCompanyDto } from '@/infrastructure/controllers/create-company-dto';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let mockCreateCompanyService: jest.Mocked<CreateCompanyService>;
  let mockGetNewAffiliatesService: jest.Mocked<GetNewAffiliatesService>;
  let mockCompaniesWithTransfersService: jest.Mocked<CompaniesWithTransfersService>;

  beforeEach(async () => {
    mockCreateCompanyService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateCompanyService>;

    mockGetNewAffiliatesService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetNewAffiliatesService>;

    mockCompaniesWithTransfersService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CompaniesWithTransfersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CreateCompanyService, useValue: mockCreateCompanyService },
        {
          provide: GetNewAffiliatesService,
          useValue: mockGetNewAffiliatesService,
        },
        {
          provide: CompaniesWithTransfersService,
          useValue: mockCompaniesWithTransfersService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should create a company', async () => {
    const createCompanyDto: CreateCompanyDto = {
      cuit: '20123456789',
      businessName: 'Test Company',
    };
    const createdCompany = new Company(
      1,
      '20123456789',
      'Test Company',
      new Date(),
    );
    mockCreateCompanyService.execute.mockResolvedValue(createdCompany);

    const result = await controller.create(createCompanyDto);

    expect(result).toEqual(createdCompany);
    expect(mockCreateCompanyService.execute).toHaveBeenCalledWith(
      createCompanyDto.cuit,
      createCompanyDto.businessName,
    );
  });

  it('should return new affiliates', async () => {
    const mockResponse = {
      data: [new Company(1, '20123456789', 'Test Company', new Date())],
      total: 1,
      limit: 10,
      offset: 0,
    };
    mockGetNewAffiliatesService.execute.mockResolvedValue(mockResponse);

    const result = await controller.getNewAffiliates(10, 0);

    expect(result).toEqual(mockResponse);
    expect(mockGetNewAffiliatesService.execute).toHaveBeenCalledWith(10, 0);
  });

  it('should return companies with transfers from last month', async () => {
    const mockResponse: PaginatedResponse<CompanyWithTransfersDto> = {
      data: [
        {
          company: new Company(1, '20123456789', 'Test Company', new Date()),
          transfers: [],
        },
      ],
      total: 1,
      limit: 10,
      offset: 0,
    };
    mockCompaniesWithTransfersService.execute.mockResolvedValue(
      Promise.resolve(mockResponse),
    );

    const result = await controller.getCompaniesWithTransfersLastMonth(10, 0);

    expect(result).toEqual(mockResponse);
    expect(mockCompaniesWithTransfersService.execute).toHaveBeenCalledWith(
      10,
      0,
    );
  });
});
