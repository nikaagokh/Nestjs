import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { CategoriesController } from './categories/categories.controller';

import { ReviewController } from './review/review.controller';
import { RatingController } from './rating/rating.controller';


import { FavoritesController } from './favorites/favorites.controller';
import { CommentsController } from './comments/comments.controller';

import { Comment } from './comments/model/comments.entity';
import { Favorites } from './favorites/model/favorites.entity';
import { Product } from './product/model/product.entity';
import { ReviewProduct } from './review/model/review.entity';
import { Tag } from './tags/model/tags.entity';
import { User } from './user/model/user.entity';

import { ReactType } from './react/model/react-type.entity';
import { ReactComment } from './reactcomment/model/reactcomment.entity';
import { ImagesController } from './images/images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Image } from './images/model/images.entity';
import { Category } from './categories/model/categories.entity';


import { Year } from './year/model/year.entity';
import { CategoryYear } from './categories/model/category-year.entity';
import { TagproductController } from './tagproduct/tagproduct.controller';
import { TagProduct } from './tagproduct/model/tag-product.entity';
import { GeneralController } from './general/general.controller';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RatingModule } from './rating/rating.module';
import { TagproductModule } from './tagproduct/tagproduct.module';
import { GatewayModule } from './gateway/gateway.module';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port:3306,
      username:'root',
      password:'rootroot',
      database:'vgpart',
      entities:['dist/**/*.entity.js'],
      synchronize:true
    }),
    //TypeOrmModule.forFeature([ReviewProduct, Tag, User, ReactType, ReactComment, Image, Category, Year, CategoryYear, TagProduct,]),
    CategoriesModule,
    ProductModule,
    CommentsModule,
    AuthModule,
    UserModule,
    CartModule,
    FavoritesModule,
    RatingModule,
    TagproductModule,
    GatewayModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
