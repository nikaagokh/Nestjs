
import { Cart } from "src/cart/model/cart.entity";
import { Category } from "src/categories/model/categories.entity";
import { Favorites } from "src/favorites/model/favorites.entity";
import { Image } from "src/images/model/images.entity";
import { Rating } from "src/rating/model/rating.entity";
import { ReviewProduct } from "src/review/model/review.entity";
import { TagProduct } from "src/tagproduct/model/tag-product.entity";
import { Tag } from "src/tags/model/tags.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum conditions {
    NEW = 'ახალი',
    SECOND_HAND = 'მეორადი'
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nameGeo:string;

    @Column()
    nameEng:string;

    @Column()
    description:string;

    @Column()
    price:number;

    @Column({default:40})
    discount:number;

    @Column()
    sku:string;

    @Column({nullable:true, default: 100})
    stck:number;

    @Column({
        type:'enum',
        enum:conditions,
        default:conditions.NEW
    })
    condition:conditions;


    @Column({default:100})
    views:number;

    @CreateDateColumn()
    created:Date;

    @UpdateDateColumn()
    updated:Date;

    @BeforeInsert()
    generateSku() {
        this.sku = '#' + Date.now().toString(36).toUpperCase();
    }
    @BeforeInsert()
    setDefaultValue() {
        if(this.description === undefined) {
            this.description = `${this.nameGeo} არის კარგ მდგომარეობაში. \n პროდუქტზე მოქმედებს მიტანის სერვისი. \n დეტალური ინფორმაციისთვის დაგვიკავშირდით`
        }
    }

    
    @ManyToOne(() => Category, cat => cat.product)
    @JoinColumn({name:'categoryId'})
    category:Category;

    @Column({nullable:true})
    categoryId:number;
    
    @OneToMany(() => Favorites, fav => fav.product)
    favorites:Favorites[];

    @OneToMany(() => Cart, cart => cart.product)
    cart:Cart[];

    @OneToMany(() => Rating, rat => rat.product)
    rating:Rating[];

    @OneToMany(() => ReviewProduct, prod => prod.product)
    review:ReviewProduct[];

    @OneToMany(() => Image, image => image.product)
    images:Image[];

    @OneToMany(() => TagProduct, t => t.product)
    tagprod:TagProduct[];

    count:number;
    
}