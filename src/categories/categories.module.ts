import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './model/categories.entity';
import { CategoryYear } from 'src/categories/model/category-year.entity';
import { CategoriesController } from './categories.controller';
import { CategoryService } from './service/category.service';
import { Year } from 'src/year/model/year.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Category, CategoryYear, Year])
    ],
    controllers:[CategoriesController],
    providers:[CategoryService],
    exports:[CategoryService]
})
export class CategoriesModule {}
