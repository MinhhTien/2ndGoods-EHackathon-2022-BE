import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { ProductImage } from './productImage';
  
  @Entity()
  export class LocalFile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    filename: string;
  
    @Column()
    path: string;

    @OneToOne(() => ProductImage, productImage => productImage.id)
    productImage: ProductImage[];
  }
  