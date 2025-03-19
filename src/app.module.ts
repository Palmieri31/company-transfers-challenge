import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from '@/infrastructure/modules/company.module';
import { dataSourceOptions } from '@/infrastructure/config/data-source';
import { TransferModule } from '@/infrastructure/modules/transfer.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/infrastructure/filters/all-exception.filter';
import { LoggerService } from '@/infrastructure/shared/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CompanyModule,
    TransferModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    LoggerService,
  ],
})
export class AppModule {}
