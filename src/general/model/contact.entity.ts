import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Contact {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column()
    phone:string;

    @Column()
    location:string;
}