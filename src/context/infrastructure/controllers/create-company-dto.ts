import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-?\d{8}-?\d{1}$/, { message: 'Invalid CUIT format' })
  @Transform(({ value }) => value.replace(/-/g, ''))
  cuit: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Business name must be at least 3 characters long' })
  businessName: string;
}
