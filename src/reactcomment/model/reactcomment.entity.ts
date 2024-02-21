import { Comment } from "src/comments/model/comments.entity";
import { ReactType } from "src/react/model/react-type.entity";
import { User } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReactComment {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Comment, com => com.react, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'commentId'})
    comment:Comment;

    @Column()
    commentId:number;

    @ManyToOne(() => ReactType, type => type.react, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'typeId'})
    type:ReactType;

    @Column()
    typeId:number;

    @ManyToOne(() => User, user => user.react, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'userId'})
    user:User;

    @Column()
    userId:number;


    likes:null;
    unlikes:null;

}