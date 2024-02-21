import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagProduct } from "../model/tag-product.entity";
import { EntityManager, Repository } from "typeorm";
import { Tag } from "src/tags/model/tags.entity";
import { TagproductController } from "../tagproduct.controller";

@Injectable()
export class TagProductService {
    constructor(
        @InjectRepository(TagProduct) private tagProductRepo:Repository<TagProduct>,
        @InjectRepository(Tag) private tagRepo:Repository<Tag>,
        private entityManager:EntityManager
    ) {}

    async addProductToTag(prodId:number, tagId:number) {
        const exist = await this.tagProductRepo.createQueryBuilder('tagprod')
        .where(`tagprod.tagid = ${tagId} and tagprod.productId = ${prodId}`)
        .getOne();
        if(exist) throw new HttpException('product already in that tag', 401);
        const tagProd = new TagProduct();
        tagProd.productId = prodId;
        tagProd.tagId = tagId;
        return await this.tagProductRepo.save(tagProd);
    }

    async updateProductToTag(prodId:number, tagId:number, newTagId:number) {
        const exist = await this.tagProductRepo.createQueryBuilder('tagprod')
        .where(`tagprod.tagid = ${tagId} and tagprod.productId = ${prodId}`)
        .getOne();
        if(!exist) throw new HttpException('product not in tag', 401);
        exist.tagId = newTagId;
        await this.tagProductRepo.save(exist);
    }

    async deleteProductToTag(prodId:number, tagId:number) {
        const exist = await this.tagProductRepo.createQueryBuilder('tagprod')
        .where(`tagprod.tagid = ${tagId} and tagprod.productId = ${prodId}`)
        .getOne();
        if(!exist) throw new HttpException('product is not there', 401);
        await this.tagProductRepo.remove(exist);
    }

    async getAllTagsOfProduct(id:number) {
        const tags = await this.tagRepo.createQueryBuilder('tag')
        .leftJoin('tag.tagProd', 'tagprod')
        .where(`tagprod.productId = ${id}`)
        .getMany();
        return tags;
    }

    async addTag(name:string, type:number) {
        if(!(type === 0 || type === 1)) throw new HttpException('type must be 0 or 1', 401); 
        const exist = await this.tagRepo.createQueryBuilder('tag')
        .where(`tag.name = '${name}'`)
        .getOne();
        if(exist) throw new HttpException('tag already exists', 401);
        const tag = new Tag();
        tag.name = name;
        tag.category = type;
        return await this.tagRepo.save(tag);
    }

    async updateTag(id:number, name:string, type:number) {
        const exist = await this.tagRepo.createQueryBuilder('tag')
        .where(`tag.id = '${id}'`)
        .getOne();
        if(!exist) throw new HttpException('tag not exist', 401);
        exist.name = name;
        exist.category = type;
        return await this.tagRepo.save(exist);
    }

    async deleteTag(id:number) {
        const exist = await this.tagRepo.createQueryBuilder('tag')
        .where(`tag.id = '${id}'`)
        .getOne();
        if(!exist) throw new HttpException('tag not exist', 401);
        return await this.tagRepo.remove(exist);
    }


}