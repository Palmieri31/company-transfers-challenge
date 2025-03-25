import { TransferRepositoryImpl } from '@/infrastructure/database/mysql-transfer-repository';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { TransferEntity } from '@/infrastructure/database/entities/transfer.entity';
import { Transfer } from '@/domains/transfer';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransferRepositoryImpl', () => {
  let repository: TransferRepositoryImpl;
  let mockRepository: jest.Mocked<Repository<TransferEntity>>;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<TransferEntity>>;

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as unknown as jest.Mocked<DataSource>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferRepositoryImpl,
        {
          provide: getRepositoryToken(TransferEntity),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<TransferRepositoryImpl>(TransferRepositoryImpl);
  });

  it('should create a transfer and return it', async () => {
    const transfer = new Transfer(
      0,
      1,
      1000,
      '1234567890',
      '0987654321',
      new Date('2025-03-18'),
    );

    const savedEntity = {
      id: 1,
      companyId: 1,
      amount: 1000,
      debitAccount: '1234567890',
      creditAccount: '0987654321',
      transferDate: new Date('2025-03-18'),
      company: null,
    };

    (mockQueryRunner.manager.save as jest.Mock).mockResolvedValue(savedEntity);

    const result = await repository.createTransfer(transfer);

    expect(result).toEqual(
      new Transfer(
        savedEntity.id,
        savedEntity.companyId,
        savedEntity.amount,
        savedEntity.debitAccount,
        savedEntity.creditAccount,
        savedEntity.transferDate,
      ),
    );

    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      expect.objectContaining({
        companyId: transfer.companyId,
        amount: transfer.amount,
        debitAccount: transfer.debitAccount,
        creditAccount: transfer.creditAccount,
        transferDate: transfer.transferDate,
      }),
    );

    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });
});
