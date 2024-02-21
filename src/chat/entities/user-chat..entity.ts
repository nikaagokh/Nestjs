import { User } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class UserChat {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User, user => user.sent)
    @JoinColumn({name:'fromId'})
    from:User;

    @Column()
    fromId:number;


    @ManyToOne(() => User, user => user.receive)
    @JoinColumn({name:'toId'})
    to:User;

    @Column()
    toId:number;

    @OneToOne(() => Message, mess => mess.chat)
    @JoinColumn({name:'messageId'})
    message:Message;

    @Column()
    messageId:number;

}