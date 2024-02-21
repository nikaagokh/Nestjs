
import { Cart } from "src/cart/model/cart.entity";
import { Message } from "src/chat/entities/message.entity";
import { UserChat } from "src/chat/entities/user-chat..entity";
import { Favorites } from "src/favorites/model/favorites.entity";
import { Rating } from "src/rating/model/rating.entity";
import { ReactComment } from "src/reactcomment/model/reactcomment.entity";
import { ReviewProduct } from "src/review/model/review.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({nullable:true})
    email:string;

    @Column()
    phone:string;

    @Column()
    password:string;

    @OneToMany(() => Cart, cart => cart.user)
    cart:Cart[];

    @OneToMany(() => Favorites, fav => fav.user)
    favorites:Favorites[];

    @OneToMany(() => Rating, rat => rat.user)
    rating:Rating[];

    @OneToMany(() => ReviewProduct, prod => prod.user)
    review:ReviewProduct[];

    @OneToMany(() => ReactComment, react => react.user)
    react:ReactComment[];

    @UpdateDateColumn()
    update:Date;


    @OneToMany(() => UserChat, us => us.from)
    sent:UserChat[];

    @OneToMany(() => UserChat, us => us.to)
    receive:UserChat[];
}