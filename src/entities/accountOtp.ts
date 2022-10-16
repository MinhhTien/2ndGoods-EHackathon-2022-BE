import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Account from './account';
import { OtpEnum } from '../utils/app.enum';

@Entity()
export class AccountOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: OtpEnum,
  })
  type: OtpEnum;

  @Column()
  otp: string;

  @Column()
  otpExpiration: Date;
}
