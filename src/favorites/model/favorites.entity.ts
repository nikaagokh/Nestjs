import { Product } from "src/product/model/product.entity";
import { User } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Favorites {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User, user => user.favorites)
    @JoinColumn({name:'userId'})
    user:User;

    @ManyToOne(() => Product, product => product.favorites)
    @JoinColumn({name:'productId'})
    product:Product;


    @Column({nullable:true})
    userId:number;

    @Column({nullable:true})
    productId:number;

    @CreateDateColumn()
    faved:Date;
}
