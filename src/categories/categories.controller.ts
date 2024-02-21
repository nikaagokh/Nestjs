import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CreateChild } from './dtos/create-child.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import {join} from 'path';
import {v4 as uuidv4} from 'uuid'
export const storage = {
    storage: diskStorage({
        destination:'./uploads/categories',
        filename:(req, file, cb) => {
            const filename:string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension:string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        }
    })
}

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService:CategoryService) {}
    
    @Get('full')
    getRootsAndChildren() {
        return this.categoryService.getAllCategoriesAndChildren();
    }
    @Get('roots')
    getRoots() {
        return this.categoryService.getAllCategories();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number) {
        return this.categoryService.getOne(id);
    }


    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id:number, @Body() category:any) {
        const obj = JSON.parse(category.data);
        return this.categoryService.updateOne(id, obj);
    }

    @Get('children/:id')
    getDescendants(@Param('id', ParseIntPipe) id:number) {
        return this.categoryService.getDescendants(id);
    }

    @Get('ancestors/:id')
    getAncestors(@Param('id', ParseIntPipe) id:number) {
        return this.categoryService.getAncestors(id);
    }

    //@UseGuards(JwtAuthGuard)
    @Post('child')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadChild(@UploadedFile() file:Express.Multer.File, @Body() child:any) {
        
        const obj = JSON.parse(child.data);
        console.log(obj)
        return this.categoryService.addChild(file.filename, obj);
    }

    @Post('parent')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadParent(@UploadedFile() file:Express.Multer.File, @Body() parent:any) {
        const obj = JSON.parse(parent.data);
        return this.categoryService.addParent(file.filename, obj);
    }

    @Put('child/:id')
    @UseInterceptors(FileInterceptor('file', storage))
    updateChild(@UploadedFile() file:Express.Multer.File, @Param('id', ParseIntPipe) id:number) {
        return this.categoryService.updateChild(id, file.filename);
    }

    
}


