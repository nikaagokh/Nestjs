import { Product } from "src/product/model/product.entity";
import { User } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User, user => user.rating)
    @JoinColumn({name:'userId'})
    user:User;

    @Column()
    userId:number;

    @ManyToOne(() => Product, prod => prod.rating)
    @JoinColumn({name:'productId'})
    product:Product;

    @Column()
    productId:number;

    @Column({nullable:true})
    rate:number;

    @CreateDateColumn()
    created:Date;

    @UpdateDateColumn()
    updated:Date;
}