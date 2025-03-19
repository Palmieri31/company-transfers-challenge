import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransferRepository } from '@/application/ports/transfer-repository.port';
import { Transfer } from '@/domains/transfer';
import { CompanyRepository } from '@/application/ports/company-repository.port';

@Injectable()
export class CreateTransferService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(
    companyId: number,
    amount: number,
    debitAccount: string,
    creditAccount: string,
  ): Promise<Transfer> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    if (debitAccount === creditAccount) {
      throw new BadRequestException(
        'Debit and credit accounts must be different',
      );
    }

    const transfer = new Transfer(
      0,
      companyId,
      amount,
      debitAccount,
      creditAccount,
      new Date(),
    );
    return this.transferRepository.createTransfer(transfer);
  }
}
