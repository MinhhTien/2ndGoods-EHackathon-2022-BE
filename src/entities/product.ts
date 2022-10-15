import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  
  import { ProductEnum } from '../utils/app.enum';
  import  Account  from './account';
  import { Category } from './category';
  import { LocalFile } from './localFile';
  import { OrderProduct } from './orderProduct';
import { ProductImage } from './productImage';
  
  @Entity()
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column({nullable: true})
    detail: string;
  
    @Column()
    amount: number;

    @Column()
    quantity: number;
  
    @Column({ default: 0 })
    sold: number;
  
    @Column({
      type: 'enum',
      enum: ProductEnum,
      default: ProductEnum.AVAILABLE,
    })
    status: ProductEnum;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column({ nullable: true })
    deletedAt: Date;
  
    @ManyToOne(() => Account, account => account.id)
    account: Account;
  
    @ManyToOne(() => Category, category => category.id)
    category: Category;
  
    @OneToMany(() => ProductImage, images => images.id)
    @JoinColumn()
    images: ProductImage[];
  
    @OneToMany(() => OrderProduct, orderProduct => orderProduct.id)
    orderProduct: OrderProduct[];
  }
  