import { json } from 'body-parser';
import {
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    OneToMany,
    Column,
    JoinColumn,
  } from 'typeorm';
import Account from './account';
import { Product } from './product';
  
  @Entity()
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    cart: string;
  
    @OneToOne(() => Account, account => account.cart)
    @JoinColumn()
    account: Account;
  }
  