import { ReactType } from "src/react/model/react-type.entity";
import { ReactComment } from "src/reactcomment/model/reactcomment.entity";
import { ReviewProduct } from "src/review/model/review.entity";
import { User } from "src/user/model/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    comment:string;

    @OneToOne(() => ReviewProduct, prod => prod.comment)
    review:ReviewProduct;

    @OneToMany(() => ReactComment, react => react.comment)
    react:ReactComment[];

    @Column({nullable:true, select:false, update:false, insert:false})
    likesCount:number

    user:User;
    type:ReactType;
    reacted:ReactType | null;
    likes:Array<any>;
    unlikes:Array<any>;
    top:Comment;

}