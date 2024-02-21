import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserChat } from "./user-chat..entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    content:string;

    @CreateDateColumn()
    created:Date;

    @OneToOne(() => UserChat, us => us.message)
    chat:UserChat;

    @Column()
    chatId:number;
}