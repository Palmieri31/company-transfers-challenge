import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateTransferDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' },
  )
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Debit account must not exceed 20 characters' })
  debitAccount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Credit account must not exceed 20 characters' })
  creditAccount: string;
}
