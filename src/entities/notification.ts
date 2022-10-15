import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Account from "./account";
import { LocalFile } from "./localFile";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @OneToOne(() => LocalFile, image => image.id)
    image: LocalFile;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => Account, account => account.id)
    @JoinTable()
    account: Account[];
}