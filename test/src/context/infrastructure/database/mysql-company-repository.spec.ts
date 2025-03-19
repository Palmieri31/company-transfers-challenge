import { Test, TestingModule } from '@nestjs/testing';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CompanyRepositoryImpl } from '@/infrastructure/database/mysql-company-repository';
import { CompanyEntity } from '@/infrastructure/database/entities/company.entity';
import { TransferEntity } from '@/infrastructure/database/entities/transfer.entity';
import { Company } from '@/domains/company';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const company = new Company(0, '20123456789', 'Test Company', new Date());

const mockCompany = {
  id: 1,
  cuit: '20123456789',
  businessName: 'Test Company',
  adhesionDate: new Date(),
  transfers: [],
};

describe('CompanyRepositoryImpl', () => {
  let repository: CompanyRepositoryImpl;
  let mockCompanyRepository: jest.Mocked<Repository<CompanyEntity>>;
  let mockTransferRepository: jest.Mocked<Repository<TransferEntity>>;

  beforeEach(async () => {
    mockCompanyRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
      find: jest.fn(),
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

  it('should create a company', async () => {
    const savedEntity = {
      id: 1,
      cuit: '20123456789',
      businessName: 'Test Company',
      adhesionDate: new Date(),
      transfers: [],
    };

    mockCompanyRepository.findOne.mockResolvedValue(null); // The company does not exist
    mockCompanyRepository.save.mockResolvedValue(savedEntity);

    const result = await repository.createCompany(company);

    expect(result).toEqual(
      new Company(
        savedEntity.id,
        savedEntity.cuit,
        savedEntity.businessName,
        savedEntity.adhesionDate,
      ),
    );
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { cuit: company.cuit },
    });
    expect(mockCompanyRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cuit: company.cuit,
        businessName: company.businessName,
        adhesionDate: company.adhesionDate,
      }),
    );
  });

  it('should throw ConflictException if the company already exists', async () => {
    mockCompanyRepository.findOne.mockResolvedValue({
      id: 1,
      cuit: '20123456789',
      businessName: 'Existing Company',
      adhesionDate: new Date(),
      transfers: [],
    });

    await expect(repository.createCompany(company)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should return new affiliates', async () => {
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
    ];
    mockCompanyRepository.count.mockResolvedValue(1);
    mockCompanyRepository.find.mockResolvedValue(mockCompanies);

    const result = await repository.getNewAffiliates(10, 0);

    expect(result).toEqual({
      data: [
        new Company(
          mockCompanies[0].id,
          mockCompanies[0].cuit,
          mockCompanies[0].businessName,
          mockCompanies[0].adhesionDate,
        ),
      ],
      total: 1,
      limit: 10,
      offset: 0,
    });
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
  });

  it('should throw NotFoundException if company is not found by ID', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should return null if company is not found by CUIT', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    const result = await repository.findByCuit('20123456789');

    expect(result).toBeNull();
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

    mockTransferRepository.find.mockResolvedValue(mockTransfers);
    mockCompanyRepository.find.mockResolvedValue(mockCompanies);

    const result = await repository.getCompaniesWithTransfersLastMonth(10, 0);

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
    expect(mockTransferRepository.find).toHaveBeenCalledWith({
      where: {
        transferDate: expect.objectContaining({
          _type: 'moreThanOrEqual',
          _value: dateLimit,
        }),
      },
      relations: ['company'],
    });
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({
      where: {
        id: expect.objectContaining({
          _type: 'in',
          _value: [1],
        }),
      },
      take: 10,
      skip: 0,
      relations: ['transfers'],
    });
  });

  it('should find a company by ID', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(mockCompany);

    const result = await repository.findById(1);

    expect(result).toEqual(
      new Company(
        mockCompany.id,
        mockCompany.cuit,
        mockCompany.businessName,
        mockCompany.adhesionDate,
      ),
    );
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException if company is not found by ID', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById(1)).rejects.toThrow(NotFoundException);
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should find a company by CUIT', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(mockCompany);

    const result = await repository.findByCuit('20123456789');

    expect(result).toEqual(
      new Company(
        mockCompany.id,
        mockCompany.cuit,
        mockCompany.businessName,
        mockCompany.adhesionDate,
      ),
    );
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { cuit: '20123456789' },
    });
  });

  it('should return null if company is not found by CUIT', async () => {
    mockCompanyRepository.findOne.mockResolvedValue(null);

    const result = await repository.findByCuit('20123456789');

    expect(result).toBeNull();
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
      where: { cuit: '20123456789' },
    });
  });
});
