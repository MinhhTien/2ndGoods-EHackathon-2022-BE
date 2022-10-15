import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
  } from 'typeorm';
  
  import { ProductEnum } from '../utils/app.enum';
  import  Account  from './account';
  import { Category } from './category';
  import { OrderProduct } from './orderProduct';
  import { ProductImage } from './productImage';
  
  @Entity()
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    detail: string;
  
    @Column()
    amount: number;
  
    @Column({ default: 0 })
    sold: number;
  
    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    star: number;
  
    @Column({
      type: 'enum',
      enum: ProductEnum,
      default: ProductEnum.AVAILABLE,
    })
    status: ProductEnum;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column({ nullable: true })
    deletedAt: Date;
  
    @ManyToOne(() => Account, account => account.id)
    @JoinColumn()
    account: Account;
  
    @ManyToOne(() => Category, category => category.id)
    @JoinColumn()
    category: Category;
  
    @OneToMany(() => ProductImage, productImage => productImage.id)
    @JoinColumn()
    productImage: ProductImage[];
  
    @OneToMany(() => OrderProduct, orderProduct => orderProduct.id)
    orderProduct: OrderProduct[];
  }
  