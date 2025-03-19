import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { CreateCompanyService } from '@/application/services/company/create-company.service';
import { CompaniesWithTransfersService } from '@/application/services/company/get-companies-with-transfers.service';
import { GetNewAffiliatesService } from '@/application/services/company/get-new-affiliates.service';
import { Company } from '@/domains/company';
import { CreateCompanyDto } from './create-company-dto';
import ValidateNumberOrUndefinedPipe from '@/infrastructure/shared/pipes/validateNumberOrUndefinedPipe';
import { PaginatedResponse } from '@/application/dto/pagination-response.dto';
import { CompanyWithTransfersDto } from '@/application/dto/company-with-transfers.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly getNewAffiliatesService: GetNewAffiliatesService,
    private readonly companiesWithTransfersService: CompaniesWithTransfersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({ description: 'company successfully created.' })
  @ApiConflictResponse({
    description: 'A company with this CUIT already exists.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.createCompanyService.execute(
      createCompanyDto.cuit,
      createCompanyDto.businessName,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('new-affiliates')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNewAffiliates(
    @Query('limit', ValidateNumberOrUndefinedPipe) limit: number,
    @Query('offset', ValidateNumberOrUndefinedPipe) offset: number,
  ): Promise<{
    data: Company[];
    total: number;
    limit: number;
    offset: number;
  }> {
    return this.getNewAffiliatesService.execute(limit, offset);
  }

  @HttpCode(HttpStatus.OK)
  @Get('companies-with-transfers')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCompaniesWithTransfersLastMonth(
    @Query('limit', ValidateNumberOrUndefinedPipe) limit: number,
    @Query('offset', ValidateNumberOrUndefinedPipe) offset: number,
  ): Promise<PaginatedResponse<CompanyWithTransfersDto>> {
    return this.companiesWithTransfersService.execute(limit, offset);
  }
}
