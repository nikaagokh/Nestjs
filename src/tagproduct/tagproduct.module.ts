import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagProduct } from './model/tag-product.entity';
import { Tag } from 'src/tags/model/tags.entity';
import { TagproductController } from './tagproduct.controller';
import { TagProductService } from './service/tag-product.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([TagProduct, Tag]),
        UserModule
    ],
    controllers:[TagproductController],
    providers:[TagProductService]
})
export class TagproductModule {}
