import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    OneToOne,
    ManyToMany,
    OneToMany,
    ManyToOne,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import { LocalFile } from './localFile';
import { GenderEnum, StatusEnum } from '../utils/app.enum';
import { Notification } from './notification';
import { Message } from './message';
import { Cart } from './cart';
import { Voucher } from './voucher';
import { OrderProduct } from './orderProduct';
import { Report } from './report';
import { Order } from './order';

@Entity()
export default class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string

    @Column({nullable: true})
    userName: string

    @Column({nullable: true})
    address: string

    @Column({ length: 100 })
    email: string;

    @Column({ length: 10, nullable: true })
    phone: string;

    @Column({ type: 'date', name: 'date_of_birth', nullable: true })
    dateOfBirth: string;

    @OneToOne(() => LocalFile)
    @JoinColumn()
    avatar: LocalFile;

    @Column({
        type: 'enum',
        enum: GenderEnum,
        nullable: true
      })
    gender: GenderEnum;

    @Column({ length: 100 })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ nullable: true })
    lockedAt: Date;

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.ACTIVE,
      })
    status: StatusEnum;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    @ManyToMany(() => Notification, notification => notification.id)
    notification: Notification[];

    @ManyToMany(() => Voucher, voucher => voucher.id)
    voucher: Voucher[];

    @OneToMany(() => Order, order => order.id)
    order: Order[];

    @OneToMany(() => Report, report => report.id)
    report: Report[]

    @OneToMany(() => Message, message => message.id)
    message: Message[];

    @OneToOne(() => Cart, cart => cart.id)
    cart: Cart;
}
