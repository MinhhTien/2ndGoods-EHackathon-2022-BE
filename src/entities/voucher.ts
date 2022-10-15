import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Order } from './order';
import Account from './account';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Account, account => account.id)
  createdBy: Account;

  @Column()
  amount: number;

  @Column('json', { nullable: true })
  condition: string;

  @Column()
  mfgDate: Date;

  @Column()
  expDate: Date;

  @ManyToMany(() => Order, order => order.id)
  order: Order[];

  @ManyToMany(() => Account, account => account.id)
    @JoinTable()
    account: Account[];
}
