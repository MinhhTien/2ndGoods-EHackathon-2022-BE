import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ReasonReportEnum, StatusReportEnum } from '../utils/app.enum';
import Account from './account';
  
  @Entity()
  export class Report {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'enum',
      enum: ReasonReportEnum,
      default: ReasonReportEnum.INACCURATE_MISLEADING,
    })
    reason: string;
  
    @Column()
    description: string;
  
    @Column()
    @CreateDateColumn()
    reportAt: Date;
  
    @Column({
      type: 'enum',
      enum: StatusReportEnum,
      default: StatusReportEnum.PROCESSED,
    })
    status: StatusReportEnum;

    @ManyToOne(() => Account, reporter => reporter.id)
    reporter: Account;
  
    @ManyToOne(() => Account, account => account.id)
    account: Account;
  
  }
  