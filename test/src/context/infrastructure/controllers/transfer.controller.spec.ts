import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from '@/infrastructure/controllers/transfer.controller';
import { CreateTransferService } from '@/application/services/transfer/create-transfer.service';
import { Transfer } from '@/domains/transfer';
import { CreateTransferDto } from '@/infrastructure/controllers/create-transfer-dto';

describe('TransferController', () => {
  let controller: TransferController;
  let mockCreateTransferService: jest.Mocked<CreateTransferService>;

  beforeEach(async () => {
    mockCreateTransferService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateTransferService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        { provide: CreateTransferService, useValue: mockCreateTransferService },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should create a transfer', async () => {
    const createTransferDto: CreateTransferDto = {
      companyId: 1,
      amount: 1000,
      debitAccount: '1234567890',
      creditAccount: '0987654321',
    };
    const createdTransfer = new Transfer(
      1,
      createTransferDto.companyId,
      createTransferDto.amount,
      createTransferDto.debitAccount,
      createTransferDto.creditAccount,
      new Date(),
    );
    mockCreateTransferService.execute.mockResolvedValue(createdTransfer);

    const result = await controller.create(createTransferDto);

    expect(result).toEqual(createdTransfer);
    expect(mockCreateTransferService.execute).toHaveBeenCalledWith(
      createTransferDto.companyId,
      createTransferDto.amount,
      createTransferDto.debitAccount,
      createTransferDto.creditAccount,
    );
  });
});
