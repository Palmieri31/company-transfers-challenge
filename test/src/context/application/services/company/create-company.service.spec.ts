import { ConflictException } from '@nestjs/common';
import { CreateCompanyService } from '@/application/services/company/create-company.service';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Company } from '@/domains/company';

describe('CreateCompanyService', () => {
  let service: CreateCompanyService;
  let mockRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockRepository = {
      findByCuit: jest.fn(),
      createCompany: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    service = new CreateCompanyService(mockRepository);
  });

  it('should throw ConflictException if the company already exists', async () => {
    mockRepository.findByCuit.mockResolvedValue(
      new Company(1, '20123456789', 'Existing Company', new Date()),
    );

    await expect(service.execute('20123456789', 'New Company')).rejects.toThrow(
      ConflictException,
    );

    expect(mockRepository.findByCuit).toHaveBeenCalledWith('20123456789');
  });

  it('should create a new company if it does not exist', async () => {
    mockRepository.findByCuit.mockResolvedValue(null);

    const newCompany = new Company(1, '20123456789', 'New Company', new Date());
    mockRepository.createCompany.mockResolvedValue(newCompany);

    const result = await service.execute('20123456789', 'New Company');

    expect(result).toEqual(newCompany);

    expect(mockRepository.findByCuit).toHaveBeenCalledWith('20123456789');
    expect(mockRepository.createCompany).toHaveBeenCalledWith(
      expect.objectContaining({
        cuit: '20123456789',
        businessName: 'New Company',
      }),
    );
  });
});
