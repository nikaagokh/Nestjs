import { Category } from "src/categories/model/categories.entity";
import { CategoryYear } from "src/categories/model/category-year.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Year {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'year'})
    start:Date;

    @Column({type:'year'})
    end:Date;

    @OneToMany(() => CategoryYear, c => c.year)
    cyear:CategoryYear[];



}