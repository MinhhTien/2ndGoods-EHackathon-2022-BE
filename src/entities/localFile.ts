import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Product } from './product';
  
  @Entity()
  export class LocalFile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    filename: string;
  
    @Column()
    path: string;
   }
  