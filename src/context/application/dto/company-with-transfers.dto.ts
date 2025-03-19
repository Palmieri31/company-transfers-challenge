import { Company } from '@/domains/company';
import { Transfer } from '@/domains/transfer';

export interface CompanyWithTransfersDto {
  company: Company;
  transfers: Transfer[];
}
