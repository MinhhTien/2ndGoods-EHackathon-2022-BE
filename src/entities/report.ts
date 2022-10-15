import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { StatusReportEnum } from '../utils/app.enum';
import Account from './account';
  
  @Entity()
  export class Report {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    reason: string;
  
    @Column()
    description: string;
  
    @Column()
    @CreateDateColumn()
    reportAt: Date;
  
    @Column({
      type: 'enum',
      enum: StatusReportEnum,
      default: StatusReportEnum.INACCURATE_MISLEADING,
    })
    status: StatusReportEnum;

    @ManyToOne(() => Account, reporter => reporter.id)
    reporter: Account;
  
    @ManyToOne(() => Account, account => account.id)
    account: Account;
  
  }
  