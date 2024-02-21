import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../model/rating.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating) private ratingRepo:Repository<Rating>,
        private entityManager:EntityManager
    ) {}

    async manageRating(userId:number, productId:number, rate:number) {
        const exist = await this.ratingRepo.createQueryBuilder('rat')
        .where(`rat.userId = ${userId} and rat.productId = ${productId}`)
        .getOne();
        exist.rate = rate;
        return await this.ratingRepo.save(exist);
    }

    async getAllRatingsOfProduct(userId:number, productId:number) {
        const prods = await this.ratingRepo.createQueryBuilder('rat')
        .leftJoinAndSelect('rat.user', 'user')
        .where(`rat.productId = ${productId}`)
        .getMany();
        prods.map((rat) => {
            delete rat.id;
            delete rat.userId;
            delete rat.productId;
            delete rat.created;
        })
        return prods;
    }

    async getAllRatingsByUser(userId:number) {
        const prods = await this.ratingRepo.createQueryBuilder('rat')
        .leftJoinAndSelect('rat.product', 'prod')
        .where(`rat.userId = ${userId}`)
        .getMany();
        prods.map((rat) => {
            delete rat.id;
            delete rat.userId
            delete rat.productId;
            delete rat.created;
        })
        return prods;
    }
    
    async getRatingByUserOfProduct(userId:number, productId:number) {
        const prods = await this.ratingRepo.createQueryBuilder('rat')
        .where(`rat.userId = ${userId} and rat.productId = ${productId}`)
        .getOne();
        if(!prods) throw new HttpException('rating not found', 401);
        return {rate: prods.rate}; 
    }

    async getAverageRatingOfProduct(productId:number) {
        const prod = await this.ratingRepo.createQueryBuilder('rat')
        .addSelect('avg(rat.rate)', 'avg')
        .where(`rat.productId = ${productId}`)
        .groupBy('rat.productId')
        .getRawOne();
        return {average:Math.floor(prod.avg)}
    }

    async deleteProductRating(userId:number, productId:number) {
        const exist = await this.ratingRepo.createQueryBuilder('rat')
        .where(`rat.productId = ${productId} and rat.userId = ${userId}`)
        .getOne();
        if(!exist) throw new HttpException('product not rated', 401);
        return await this.ratingRepo.remove(exist);
    }

    
}