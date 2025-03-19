import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateTransferService } from '@/application/services/transfer/create-transfer.service';
import { Transfer } from '@/domains/transfer';
import { CreateTransferDto } from './create-transfer-dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('transfers')
@Controller('transfers')
export class TransferController {
  constructor(private readonly createTransferService: CreateTransferService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiNotFoundResponse({ description: 'Company not found.' })
  @ApiCreatedResponse({ description: 'transfer successfully created.' })
  @ApiBadRequestResponse({
    description: 'Debit and credit accounts must be different.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body()
    createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return this.createTransferService.execute(
      createTransferDto.companyId,
      createTransferDto.amount,
      createTransferDto.debitAccount,
      createTransferDto.creditAccount,
    );
  }
}
