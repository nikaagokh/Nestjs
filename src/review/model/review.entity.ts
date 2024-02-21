import { Comment } from "src/comments/model/comments.entity";
import { Product } from "src/product/model/product.entity";
import { User } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ReviewProduct {
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(() => Comment, comm => comm.review, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'commentId'})
    comment:Comment;

    @Column()
    commentId:number;

    @ManyToOne(() => User, user => user.review, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'userId'})
    user:User;

    @Column()
    userId:number;

    @ManyToOne(() => Product, prod => prod.review, {
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'productId'})
    product:Product;

    @Column()
    productId:number;
}