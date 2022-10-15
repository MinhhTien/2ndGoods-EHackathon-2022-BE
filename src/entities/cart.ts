import {
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
import Account from './account';
import { Product } from './product';
  
  @Entity()
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToMany(() => Product, product => product.id)
    product: Product[];
  
    @OneToOne(() => Account, account => account.id)
    account: Account;
  }
  