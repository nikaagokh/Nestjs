import { CONFIGURABLE_MODULE_ID } from "@nestjs/common/module-utils/constants";
import { Product } from "src/product/model/product.entity";
import { TagProduct } from "src/tagproduct/model/tag-product.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    category:number;

    @OneToMany(() => TagProduct, t => t.tag)
    tagprod:TagProduct[];
}