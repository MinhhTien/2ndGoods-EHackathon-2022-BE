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
  
    @OneToOne(() => LocalFile, localFile => localFile.id)
    @JoinColumn()
    localFile: LocalFile;
  
    @ManyToOne(() => Product, product => product.id)
    product: Product;
  }
  