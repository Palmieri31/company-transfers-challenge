import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity()
export class TransferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  companyId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  debitAccount: string;

  @Column({ type: 'varchar', length: 20 })
  creditAccount: string;

  @Column({ type: 'date' })
  transferDate: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.transfers)
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;
}
