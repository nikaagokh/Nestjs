import { Product } from "src/product/model/product.entity";
import { Tag } from "src/tags/model/tags.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagProduct {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Product, prod => prod.tagprod)
    @JoinColumn({name:'productId'})
    product:Product;

    @Column({nullable:true})
    productId:number;

    @ManyToOne(() => Tag, tag => tag.tagprod)
    @JoinColumn({name:'tagId'})
    tag:Tag;

    @Column({nullable:true})
    tagId:number;
}