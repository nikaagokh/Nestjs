import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './model/product.entity';
import { TagProduct } from 'src/tagproduct/model/tag-product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './service/product.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
@Module({
    imports:[
        TypeOrmModule.forFeature([Product, TagProduct]),
        CategoriesModule,
        UserModule
    ],
    controllers:[ProductController],
    providers:[ProductService]
})
export class ProductModule {
    /*
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProductViewMiddleware)
        .forRoutes('product/:id')
    }
    */
}

