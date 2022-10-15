import {
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    OneToMany,
    Column,
  } from 'typeorm';
import Account from './account';
import { Product } from './product';
  
  @Entity()
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;
  
    @OneToMany(() => Product, product => product.id)
    product: Product[];
  
    @OneToOne(() => Account, account => account.id)
    account: Account;
  }
  