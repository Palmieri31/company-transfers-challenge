import { CreateTransferService } from '@/application/services/transfer/create-transfer.service';
import { TransferRepository } from '@/application/ports/transfer-repository.port';
import { CompanyRepository } from '@/application/ports/company-repository.port';
import { Transfer } from '@/domains/transfer';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Company } from '@/domains/company';

describe('CreateTransferService', () => {
  let service: CreateTransferService;
  let mockTransferRepository: jest.Mocked<TransferRepository>;
  let mockCompanyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockTransferRepository = {
      createTransfer: jest.fn(),
    } as unknown as jest.Mocked<TransferRepository>;

    mockCompanyRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<CompanyRepository>;

    service = new CreateTransferService(
      mockTransferRepository,
      mockCompanyRepository,
    );
  });

  it('should throw NotFoundException if the company does not exist', async () => {
    mockCompanyRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute(1, 1000, '1234567890', '0987654321'),
    ).rejects.toThrow(NotFoundException);

    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException if debit and credit accounts are the same', async () => {
    mockCompanyRepository.findById.mockResolvedValue(
      new Company(1, '20123456789', 'Test Company', new Date()),
    );

    await expect(
      service.execute(1, 1000, '1234567890', '1234567890'),
    ).rejects.toThrow(BadRequestException);

    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should create a new transfer if all conditions are met', async () => {
    mockCompanyRepository.findById.mockResolvedValue(
      new Company(1, '20123456789', 'Test Company', new Date()),
    );

    const newTransfer = new Transfer(
      1,
      1,
      1000,
      '1234567890',
      '0987654321',
      new Date(),
    );
    mockTransferRepository.createTransfer.mockResolvedValue(newTransfer);

    const result = await service.execute(1, 1000, '1234567890', '0987654321');

    expect(result).toEqual(newTransfer);

    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(1);
    expect(mockTransferRepository.createTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        companyId: 1,
        amount: 1000,
        debitAccount: '1234567890',
        creditAccount: '0987654321',
      }),
    );
  });
});
