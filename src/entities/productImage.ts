import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { LocalFile } from './localFile';
  import { Product } from './product';
  
  @Entity()
  export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => LocalFile)
    @JoinColumn()
    localFile: LocalFile;
  
    @ManyToOne(() => Product, product => product.images)
    product: Product;
  }
  