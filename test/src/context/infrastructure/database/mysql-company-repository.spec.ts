import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepositoryImpl } from '@/infrastructure/database/mysql-company-repository';
import { Repository } from 'typeorm';
import { CompanyEntity } from '@/infrastructure/database/entities/company.entity';
import { TransferEntity } from '@/infrastructure/database/entities/transfer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Company } from '@/domains/company';

const mockCompany = new Company(1, '20123456789', 'Test Company', new Date());

const mockCompanyEntity = {
  id: 1,
  cuit: '20123456789',
  businessName: 'Test Company',
  adhesionDate: mockCompany.adhesionDate,
  transfers: [],
};

describe('CompanyRepositoryImpl', () => {
  let repository: CompanyRepositoryImpl;
  let mockCompanyRepository: jest.Mocked<Repository<CompanyEntity>>;
  let mockTransferRepository: jest.Mocked<Repository<TransferEntity>>;

  beforeEach(async () => {
    mockCompanyRepository = {
      save: jest.fn(),
      count: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<CompanyEntity>>;

    mockTransferRepository = {
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<TransferEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRepositoryImpl,
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: mockCompanyRepository,
        },
        {
          provide: getRepositoryToken(TransferEntity),
          useValue: mockTransferRepository,
        },
      ],
    }).compile();

    repository = module.get<CompanyRepositoryImpl>(CompanyRepositoryImpl);
  });

  it('should create and return a new company', async () => {
    mockCompanyRepository.save.mockResolvedValue(mockCompanyEntity);

    const result = await repository.createCompany(mockCompany);

    expect(mockCompanyRepository.save).toHaveBeenCalledWith({
      cuit: mockCompany.cuit,
      businessName: mockCompany.businessName,
      adhesionDate: mockCompany.adhesionDate,
    });
    expect(result).toEqual(mockCompany);
  });

  it('should return new affiliates and total count', async () => {
    const dateLimit = new Date();
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

    mockCompanyRepository.count.mockResolvedValue(2);
    mockCompanyRepository.find.mockResolvedValue(mockCompanies);

    const result = await repository.getNewAffiliatesRaw(dateLimit, 10, 0);

    expect(mockCompanyRepository.count).toHaveBeenCalledWith({
      where: {
        adhesionDate: expect.objectContaining({
          _type: 'moreThanOrEqual',
          _value: dateLimit,
        }),
      },
    });
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({
      where: {
        adhesionDate: expect.objectContaining({
          _type: 'moreThanOrEqual',
          _value: dateLimit,
        }),
      },
      take: 10,
      skip: 0,
    });
    expect(result).toEqual({ companies: mockCompanies, total: 2 });
  });

  it('should return a company', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(mockCompanyEntity);

    const result = await repository.findById(1);

    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(
      new Company(
        mockCompanyEntity.id,
        mockCompanyEntity.cuit,
        mockCompanyEntity.businessName,
        mockCompanyEntity.adhesionDate,
      ),
    );
  });

  it('should throw NotFoundException when company is not found', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById(1)).rejects.toThrow(
      new NotFoundException('Company with ID 1 not found'),
    );
  });

  it('should return a company when found', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(mockCompanyEntity);

    const result = await repository.findByCuit('20123456789');

    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { cuit: '20123456789' },
    });
    expect(result).toEqual(
      new Company(
        mockCompanyEntity.id,
        mockCompanyEntity.cuit,
        mockCompanyEntity.businessName,
        mockCompanyEntity.adhesionDate,
      ),
    );
  });

  it('should return null when company is not found', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    const result = await repository.findByCuit('20123456789');

    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { cuit: '20123456789' },
    });
    expect(result).toBeNull();
  });
});
