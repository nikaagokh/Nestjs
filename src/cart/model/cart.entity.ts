import { Product } from "src/product/model/product.entity";
import { User } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User, user => user.cart)
    @JoinColumn({name:'userId'})
    user:User;

    @ManyToOne(() => Product, product => product.cart)
    @JoinColumn({name:'productId'})
    product:Product;

    @Column({nullable:true})
    userId:number;

    @Column({nullable:true})
    productId:number;

    @Column()
    quantity:number;
}
