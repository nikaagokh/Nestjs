import { CategoryYear } from "src/categories/model/category-year.entity";
import { Product } from "src/product/model/product.entity";
import { Year } from "src/year/model/year.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
 
    
    @ManyToOne(() => Category, category => category.subcategories, {
        onDelete:'SET NULL'
    })
    @JoinColumn({name:'categoryId'})
    category:Category;

    @Column({nullable:true})
    categoryId:number;
    
    @Column({nullable:true})
    image:string;
    
    @OneToMany(() => Category, category => category.category)
    subcategories:Category[];
    
    @OneToMany(() => Product, prod => prod.category)
    product:Product[];

    @OneToMany(() => CategoryYear, c => c.category)
    cyear:CategoryYear[];

    children:Category[];
    
}