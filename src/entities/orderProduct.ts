import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Account from "./account";
import { Order } from "./order";
import { Product } from "./product";

@Entity()
export class OrderProduct{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    additionalInfo: string;

    @ManyToOne(() => Account, account => account.id)
    account: Account;

    @ManyToOne(() => Product, product => product.id)
    product: Product;

    @ManyToOne(() => Order, orderNumber => orderNumber.id )
    orderNumber: Order;

}