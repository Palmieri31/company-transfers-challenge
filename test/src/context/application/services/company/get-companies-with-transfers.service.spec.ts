import { CompaniesWithTransfersService } from '@/application/services/company/get-companies-with-transfers.service';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';

describe('CompaniesWithTransfersService', () => {
  let service: CompaniesWithTransfersService;
  let mockRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockRepository = {
      getCompaniesWithTransfersLastMonth: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    service = new CompaniesWithTransfersService(mockRepository);
  });

  it('should call getCompaniesWithTransfersLastMonth with correct arguments', async () => {
    const mockResponse: PaginatedResponse<CompanyWithTransfersDto> = {
      data: [],
      total: 0,
      limit: 10,
      offset: 0,
    };
    mockRepository.getCompaniesWithTransfersLastMonth.mockResolvedValue(
      mockResponse,
    );

    const limit = 10;
    const offset = 0;
    const result = await service.execute(limit, offset);

    expect(
      mockRepository.getCompaniesWithTransfersLastMonth,
    ).toHaveBeenCalledWith(limit, offset);

    expect(result).toEqual(mockResponse);
  });

  it('should return the paginated response from the repository', async () => {
    const mockResponse: PaginatedResponse<CompanyWithTransfersDto> = {
      data: [
        {
          company: {
            id: 1,
            cuit: '20123456789',
            businessName: 'Test Company',
            adhesionDate: new Date(),
          },
          transfers: [
            {
              id: 101,
              amount: 1000,
              companyId: 1,
              debitAccount: '1234567890',
              creditAccount: '0987654321',
              transferDate: new Date(),
            },
          ],
        },
      ],
      total: 1,
      limit: 10,
      offset: 0,
    };
    mockRepository.getCompaniesWithTransfersLastMonth.mockResolvedValue(
      mockResponse,
    );

    const result = await service.execute(10, 0);

    expect(result).toEqual(mockResponse);
  });
});
