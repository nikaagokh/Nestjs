import { ReactComment } from "src/reactcomment/model/reactcomment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReactType {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({nullable:true})
    emoji:string;

    @OneToMany(() => ReactComment, react => react.type)
    react:ReactComment[];
}