import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Account from "./account";
import { Order } from "./order";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @OneToOne(() => Order, order => order.notification)
    @JoinColumn()
    order: Order;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Account, account => account.id)
    @JoinTable()
    account: Account[];
}