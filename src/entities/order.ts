import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatusEnum, StatusEnum } from "../utils/app.enum";
import Account from "./account";
import { OrderProduct } from "./orderProduct";
import { Payment } from "./payment";
import { Voucher } from "./voucher";
import { Notification } from "./notification";

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    address: string;

    @Column()
    totalBill: number;

    @Column()
    totalPayment: number;

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.CHECKING
    })
    status: OrderStatusEnum;

    @ManyToOne(() => Account, account => account.id)
    account: Account;

    @ManyToOne(() => Payment, payment => payment.id)
    payment: Payment;

    @ManyToMany(() => Voucher, voucher => voucher.id)
    @JoinTable()
    voucher: Voucher[];

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.id)
    orderProduct: OrderProduct[];

    @OneToOne(() => Notification, notification => notification.order)
    notification: Notification;
}