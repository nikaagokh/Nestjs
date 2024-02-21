import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorites } from "../model/favorites.entity";
import { EntityManager, Repository } from "typeorm";
import { Product } from "src/product/model/product.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites) private favRepo:Repository<Favorites>,
        private entityManager:EntityManager
    ) {}


    async manageFavorites(prodId:number, userId:number) {
        const prod = await this.entityManager.getRepository(Product).createQueryBuilder('prod')
        .where(`prod.id =${prodId}`).getOne();
        if(!prod) throw new HttpException('product not found', HttpStatus.BAD_REQUEST);
        const fav = await this.favRepo.createQueryBuilder('fav').where(`fav.productId = ${prodId} and fav.userId = ${userId}`).getOne();
        return this.generateFaved(fav, prodId, userId);
    }

    async clearFavoritesOfUser(userId:number) {
        const prods = await this.favRepo.createQueryBuilder('fav')
        .where(`fav.userId = ${userId}`)
        .getMany();
        return await this.favRepo.remove(prods);
    }

    async checkIfFavorite(userId:number, prodId:number) {
        const prod = await this.favRepo.createQueryBuilder('fav')
        .where(`fav.userId = ${userId} and fav.productId = ${prodId}`)
        .getOne();
        if(!prod) return {favorite:false}
        return {favorite:true};
    }

    private async generateFaved(fav:Favorites | null, prodId:number, userId:number) {
        if(fav) {
            return await this.favRepo.remove(fav);
        } else {
            const fav = new Favorites();
            fav.productId = prodId;
            fav.userId = userId;
            return await this.favRepo.save(fav);
        }
    }


}