import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../model/product.entity";
import { EntityManager, Repository } from "typeorm";
import { TagProduct } from "src/tagproduct/model/tag-product.entity";
import { CategoryService } from "src/categories/service/category.service";
import { ICart } from "src/cart/model/cart.interface";
import { AddProductDto } from "../dto/add-product.dto";
import { Image } from "src/images/model/images.entity";

import { Multer } from "multer";
import { promisify } from "util";
import { unlink } from "fs";
import { join } from "path";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
const fs = require('fs');


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(TagProduct) private tagProductRepo:Repository<TagProduct>,
        private entityManager:EntityManager,
        private categoryService:CategoryService
    ){}

    /*
    async getProductsByCategory(id:number) {
        let ids = [id];
        const categories = await this.categoryService.getDescendants(id);
        
        if(categories.length > 0) {
            const catIds = categories.map(obj => obj.id);
            ids = ids.concat(catIds);
        }

        return await this.productRepo.createQueryBuilder('pr')
        .where('pr.categoryId in (:...ids)', {ids})
        .getMany();
        
    }
    */
    async getProductsByCategory(options:IPaginationOptions, id:number) {
        let ids = [id];
        const categories = await this.categoryService.getDescendants(id);
        
        if(categories.length > 0) {
            const catIds = categories.map(obj => obj.id);
            ids = ids.concat(catIds);
        }

        const bq = this.productRepo.createQueryBuilder('pr')
        .where('pr.categoryId in (:...ids)', {ids});

        return paginate(bq, options);
    }
    
    async getProductsByTag(options:IPaginationOptions, id:number) {
        const bq = this.productRepo.createQueryBuilder('prod')
        .leftJoin('prod.tagprod', 'tag')
        .where(`tag.tagId = ${id}`)
        return paginate(bq, options);
        //.getMany();
    }
    
    async getProductsByFav(id:number) {
        return await this.productRepo.createQueryBuilder('prod')
        .leftJoin('prod.favorites', 'fav')
        .where(`fav.userId = ${id}`)
        .getMany();
    }

    async getTopRatedProducts() {
        return await this.productRepo.createQueryBuilder('prod')
        .leftJoin('prod.rating', 'rating')
        .where('rating.rate in (4,5)')
        .getMany();
    }

    async getTopFavoritedProducts() {
        const prod = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.favorites', 'fav')
        .groupBy('prod.id')
        .orderBy('count(fav.id)', 'DESC')
        .limit(10)
        .getMany();
        return prod;
    }
    
    async getProductsByRating(id:number) {
        const prodRatings = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.rating', 'rating')
        .leftJoinAndSelect('rating.user', 'user')
        .where('rating.userId = 1')
        .getMany();
        
        prodRatings.map((prod) => {
            prod.rating.map((rat) => {
                delete rat.id;
                delete rat.userId;
                delete rat.productId;
                delete rat.updated 
            })
        })
        
       return prodRatings
    }

    async getProductUsersByReviews(id:number) {
        const prodReviews = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.review', 'review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.comment', 'comm')
        .leftJoinAndSelect('comm.react', 'react')
        .leftJoinAndSelect('react.type', 'type')
        .leftJoinAndSelect('react.user', 'us')
        .where(`review.userId = ${1}`)
        .getMany();
        prodReviews.map((prod) => {
            prod.review.map((rat) => {
                delete rat.id;
                delete rat.userId;
                delete rat.commentId;
                delete rat.productId
                rat.comment.react.map((react) => {
                    delete react.id;
                    delete react.commentId;
                    delete react.typeId;
                    delete react.userId;
                })
            })
        })
        return prodReviews
    }

    async getProductByReviews(id:number) {
        const prodReviews = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.review', 'review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.comment', 'comm')
        .leftJoinAndSelect('comm.react', 'react')
        .leftJoinAndSelect('react.type', 'type')
        .leftJoinAndSelect('react.user', 'us')
        .where(`prod.id = ${id}`)
        .getMany();
        
        prodReviews.map((prod) => {
            prod.review.map((rat) => {
                delete rat.id;
                delete rat.userId;
                delete rat.commentId;
                delete rat.productId
                rat.comment.react.map((react) => {
                    delete react.id;
                    delete react.commentId;
                    delete react.typeId;
                    delete react.userId;
                })
            })
        })
        return prodReviews
    }
    

    async getOne(id:number) {
        return await this.productRepo.createQueryBuilder('prod')
        .where(`prod.id = ${id}`)
        .getOne();
    }

    async getBySearch(word:string) {
        return await this.productRepo.createQueryBuilder('prod')
        .where(`prod.nameGeo like '%${word}%' or prod.nameEng like '%${word}%'`)
        .getMany();
    }

    async getProductsByCart(id:number) {
        const prods = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.cart', 'cart')
        .where(`cart.userId = ${id}`)
        .getMany();
        let total = 0;
        let disc = 0;
        prods.map((prod) => {
            prod.count = prod.cart[0].quantity;
            delete prod.cart
            total+=prod.price * prod.count
            disc+= (prod.price*(100-prod.discount)/100) * prod.count
        })
        const cart:ICart = {};
        cart.products = prods;
        cart.total = total;
        cart.discount = disc;
        return cart;
        
    }

    async countByTags() {
        const raw = await this.productRepo.createQueryBuilder('prod')
        .leftJoinAndSelect('prod.tagprod', 'tagprod')
        .groupBy('tagprod.tagId')
        .getMany()
        raw.map((p) => {
            p.count = p.tagprod.length
            delete p.tagprod
        })
        return raw
    }

    async addOne(fileName:string, product:AddProductDto) {

    }

    async deleteOne(id:number) {

    }

    async updateOne(id:number, product:any) {

    }

    async addFile(files:Array<Express.Multer.File>, obj:any) {
        const prod = new Product();
        prod.nameGeo = obj.nameGeo;
        prod.nameEng = obj.nameEng;
        prod.price = obj.price;
        const product = await this.productRepo.save(prod);
        const images = this.addImages(files, product.id);
    }

    async addImages(files:Array<Express.Multer.File>, id:number) {
        let images:Image[] = [];
        for(const file of files) {
            const image = new Image();
            image.productId = id;
            image.path = file.filename;
            images.push(image);
        }
        const imm = await this.entityManager.getRepository(Image).save(images);
        if(!imm) this.deleteImages(files);
        return imm;
    }

    async deleteImages(files:Array<Express.Multer.File>) {
        const names = files.map(file => file.filename);
        const path = join(process.cwd(), 'uploads/product-images');
        fs.readdir(path, (err, files) => {
            if(err) throw err;
            for(const file of files) {
                if(names.includes(file)) {
                    console.log(file);
                    const filepath = join(path,file);
                    fs.unlink(filepath, (err) => {
                        if(err) throw err;
                    })
                }
            }
        })
    }

    async incrementViews(prodId:number) {
        const prod = await this.productRepo.createQueryBuilder('prod')
        .where(`prod.id = ${prodId}`).getOne();
        if(prod) {
            prod.views += 1;
            await this.productRepo.save(prod);
            
        }
    }


}