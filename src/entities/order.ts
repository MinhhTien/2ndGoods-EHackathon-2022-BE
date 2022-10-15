import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatusEnum, StatusEnum } from "../utils/app.enum";
import { OrderProduct } from "./orderProduct";
import { Payment } from "./payment";
import { Voucher } from "./voucher";

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

    @ManyToOne(() => Payment, payment => payment.id)
    payment: Payment;

    @ManyToMany(() => Voucher, voucher => voucher.id)
    @JoinTable()
    voucher: Voucher[];

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.id)
    orderProduct: OrderProduct[];

}