import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../model/cart.entity";
import { EntityManager, Repository } from "typeorm";
import { Product } from "src/product/model/product.entity";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo:Repository<Cart>,
        private entityManager:EntityManager
    ) {}

    async addOne(prodId:number, userId:number) {
        const prod = await this.entityManager.getRepository(Product).findOneBy({id:prodId});
        if(!prod) throw new HttpException('product not found', HttpStatus.BAD_REQUEST);
        const exist = await this.cartRepo.createQueryBuilder('cart').where(`cart.productId = ${prodId} and cart.userId = ${userId}`).getOne();
        return this.manageAdd(exist, prodId, userId);
    }


    async removeOne(prodId:number, userId:number) {
        const prod = await this.entityManager.getRepository(Product).findOneBy({id:prodId});
        if(!prod) throw new HttpException('product not found', HttpStatus.BAD_REQUEST);
        const exist = await this.cartRepo.createQueryBuilder('cart').where(`cart.productId = ${prodId} and cart.userId = ${userId}`).getOne();
        return this.manageRemove(exist, prodId, userId);
    }


    async manageMultipleAddOrRemove(prodId:number,qt:number, userId:number) {
        const prod = await this.entityManager.getRepository(Product).findOneBy({id:prodId});
        if(!prod) throw new HttpException('product not found', HttpStatus.BAD_REQUEST);
        const exist = await this.cartRepo.createQueryBuilder('cart').where(`cart.productId = ${prodId} and cart.userId = ${userId}`).getOne();
        if(!exist) throw new HttpException('product dont exist in cart', HttpStatus.BAD_REQUEST);
        exist.quantity = qt;
        return await this.cartRepo.save(exist);
    }

    async clearCart(userId:number) {
        const carts = await this.cartRepo.createQueryBuilder('cart').where(`cart.userId = ${userId}`).getMany();
        if(!carts) throw new HttpException('cart is already empty', HttpStatus.BAD_REQUEST);
        return await this.cartRepo.remove(carts);
    }

    async getQuantity(userId:number) {
        let count = 0;
        const carts = await this.cartRepo.createQueryBuilder('cart').where(`cart.userId = ${userId}`).getMany();
        carts.forEach((cart) => {
            count+=cart.quantity
        })
        return count;
    }

    async getProductCounts(userId:number) {
        const carts = await this.cartRepo.createQueryBuilder('cart').where(`cart.userId = ${userId}`).getMany();
        return carts.length;
    }

    private async manageRemove(exist:Cart | null, prodId:number, userId:number) {
        if(exist && exist.quantity !== 1) {
            exist.quantity--;
            return await this.cartRepo.save(exist);
        } else if (exist && exist.quantity === 1) {
            return await this.cartRepo.remove(exist);
        } else {
            throw new HttpException('cannot remove product, that does not exist', HttpStatus.BAD_REQUEST);
        }

    }


    private async manageAdd(exist:Cart, prodId:number, userId:number) {
        if(exist) {
            exist.quantity++;
            return await this.cartRepo.save(exist);
        } else {
            const cart = new Cart();
            cart.productId = prodId;
            cart.userId = userId;
            cart.quantity = 1;
            return await this.cartRepo.save(cart);
        }
    }






}