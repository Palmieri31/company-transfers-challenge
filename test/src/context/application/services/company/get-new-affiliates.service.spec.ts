import { GetNewAffiliatesService } from '@/application/services/company/get-new-affiliates.service';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';

describe('GetNewAffiliatesService', () => {
  let service: GetNewAffiliatesService;
  let mockRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockRepository = {
      getNewAffiliates: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    service = new GetNewAffiliatesService(mockRepository);
  });

  it('should call getNewAffiliates with correct arguments', async () => {
    const mockResponse = {
      data: [],
      total: 0,
      limit: 10,
      offset: 0,
    };
    mockRepository.getNewAffiliates.mockResolvedValue(mockResponse);

    const limit = 10;
    const offset = 0;
    const result = await service.execute(limit, offset);

    expect(mockRepository.getNewAffiliates).toHaveBeenCalledWith(limit, offset);

    expect(result).toEqual(mockResponse);
  });

  it('should return the paginated response from the repository', async () => {
    const mockResponse = {
      data: [new Company(1, '20123456789', 'Test Company', new Date())],
      total: 1,
      limit: 10,
      offset: 0,
    };
    mockRepository.getNewAffiliates.mockResolvedValue(mockResponse);

    const result = await service.execute(10, 0);

    expect(result).toEqual(mockResponse);
  });
});
