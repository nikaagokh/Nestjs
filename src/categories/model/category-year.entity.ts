import { Category } from "src/categories/model/categories.entity";
import { Year } from "src/year/model/year.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class CategoryYear {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Category, cat => cat.cyear)
    @JoinColumn({name:'categoryId'})
    category:Category;

    @Column({nullable:true})
    categoryId:number;

    @ManyToOne(() => Year, year => year.cyear)
    @JoinColumn({name:'yearId'})
    year:Year;

    @Column({nullable:true})
    yearId:number;

    @Column({nullable:true})
    imageUrl:string;

    range:string;
    
}