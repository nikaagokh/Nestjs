import { Product } from "src/product/model/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true})
    path:string;

    @ManyToOne(() => Product, prod => prod.images)
    @JoinColumn({name:'productId'})
    product:Product;

    @Column()
    productId:number;
}