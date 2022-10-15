import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
  } from 'typeorm';
import Account from './account';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    message: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Account, receiver => receiver.id)
    receiver: Account;

    @ManyToOne(() => Account, sender => sender.id)
    sender: Account;

  }
  