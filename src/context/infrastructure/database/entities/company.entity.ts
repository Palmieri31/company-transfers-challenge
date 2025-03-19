import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TransferEntity } from './transfer.entity';

@Entity()
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  cuit: string;

  @Column({ type: 'text' })
  businessName: string;

  @Column({ type: 'date' })
  adhesionDate: Date;

  @OneToMany(() => TransferEntity, (transfer) => transfer.company)
  transfers: TransferEntity[];
}
