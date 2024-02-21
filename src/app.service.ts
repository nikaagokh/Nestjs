import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Product } from './product/model/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './images/model/images.entity';
import { join } from 'path';
import { Category } from './categories/model/categories.entity';
import { Multer } from 'multer';
import { User } from './user/model/user.entity';
import { Favorites } from './favorites/model/favorites.entity';
import { Rating } from './rating/model/rating.entity';
import { Comment } from './comments/model/comments.entity';
import { ReviewProduct } from './review/model/review.entity';
import { ReactType } from './react/model/react-type.entity';
import { ReactComment } from './reactcomment/model/reactcomment.entity';


@Injectable()
export class AppService {
  /*
  constructor(
    @InjectRepository(Product) private productRepo:Repository<Product>,
    @InjectRepository(Image) private imgRepo:Repository<Image>,
    @InjectRepository(Category) private catRepo:Repository<Category>,
    private entityManager:EntityManager,
  ) {}
  async getHello(files:Array<Express.Multer.File>, json:string) {
    const j = JSON.parse(json);
    const product = new Product();
    product.nameGeo = j.namegeo;
    product.nameEng = j.nameeng;
    product.price = j.price;
    const us = await this.productRepo.save(product);
    await this.saveImages(files, us);
    
  }
  async saveImages(files:Array<Express.Multer.File>, us:Product) {
    for(const file of files) {
      const image = new Image();
      image.product = us;
      image.path = file.filename;
      await this.imgRepo.save(image);
    }
  }
  async getImages(id:number) {
    const images = await this.imgRepo.createQueryBuilder('img').where('img.productId = 10').getMany();
    const imgArr = [];
    images.forEach((im) => {
      let img = join(process.cwd(), 'uploads/profiles/' + im.path);
      imgArr.push(img);
    })
    return 
  }
  async addCategories() {
    
  }
  async addLogo(file:Express.Multer.File, id:number) {
    const reps = await this.catRepo.createQueryBuilder('cat').where(`cat.id = ${id} or cat.categoryId = ${id}`).getMany();
    reps.map((cat) => {
      cat.image = file.filename
    })
    await this.catRepo.save(reps);
  }
  async getAudis() {
    return this.catRepo.createQueryBuilder('cat').where('cat.id = 1 or cat.id =2 or cat.id =3').getMany();
  }
  async getProds() {
    const cart = await this.entityManager.getRepository(Cart).createQueryBuilder('c').where('c.id = 1').getOne();
    const prod = await this.entityManager.getRepository(Product).createQueryBuilder('p').getMany();
    prod.map((prod, i) => {
      const num = i % 5;
      const pr = new CartProduct();
      pr.cart = cart;
      pr.product = prod;
      pr.quantity = num;
      this.saveFav(pr);
    })

  }
  async saveFav(rat:CartProduct) {
    await this.entityManager.getRepository(CartProduct).save(rat)
  }
  */
}
