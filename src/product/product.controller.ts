import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { hasRoles } from 'src/auth/guards/role.decorator';
import { UserRole } from 'src/user/model/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import {join} from 'path';
import {v4 as uuidv4} from 'uuid';
const fs = require('fs');
import * as sharp from 'sharp';
import { promisify } from 'util';
import { unlink } from 'fs';

export const storage = {
    storage: diskStorage({
        destination:'./uploads/profile',
        filename:(req, file, cb) => {
            const filename:string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension:string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        }
    })
}


@Controller('product')
export class ProductController {
    public route = 'http://localhost:3000/api/product';
    constructor(private productService:ProductService) {}
    
    @Get('category/:id')
    getProductsByCategory(
        @Param('id', ParseIntPipe) id:number,
        @Query('page') page:number =1, 
        @Query('limit') limit:number = 10,
        ) {
        return this.productService.getProductsByCategory({
            page:Number(page), limit:Number(limit), route:this.route
        },id);
    }

    @Get('tag/:id')
    getProductsByTag(
        @Param('id', ParseIntPipe) id:number,
        @Query('page') page:number =1, 
        @Query('limit') limit:number = 10) {
        return this.productService.getProductsByTag({
            page:Number(page), limit:Number(limit), route:this.route
        }, id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('favorites/user')
    getProductsByFav(@Request() req) {
        const id = req.user.id;
        return this.productService.getProductsByFav(id);
    }

    @Get('favorites/all')
    getTopFavoritedProducts() {
        return this.productService.getTopFavoritedProducts();
    }

    //@UseGuards(JwtAuthGuard)
    @Get('top')
    getTopRatedProducts(@Request() req) {
        //const id = req.user.id;
        return this.productService.getTopRatedProducts();
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('ratings')
    getProductsByRating(@Request() req) {
        const id = req.user.id;
        return this.productService.getProductsByRating(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('reviews')
    getProductUsersByReviews(@Request() req) {
        const id = req.user.id;
        return this.productService.getProductUsersByReviews(id);
    }

    @Get('reviews/:id')
    getProductByReviews(@Param('id', ParseIntPipe) id:number) {
        return this.productService.getProductByReviews(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('cart')
    getProductsByCart(@Request() req) {
        const id = req.user.id;
        return this.productService.getProductsByCart(id)
    }


    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number) {
        return this.productService.getOne(id);
    }

    @Get('searchby/:word')
    getBySearch(@Param('word') word:string) {
        return this.productService.getBySearch(word);
    }

    //@hasRoles(UserRole.ADMIN)
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Post('add')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() files:Array<Express.Multer.File>, @Body() body:any) {
        const obj = JSON.parse(body.data);
        return this.productService.addFile(files, obj);
        /*
        const filename = 'dadwa213';
        const path = join(process.cwd(), 'uploads/product-images');
        fs.readdir(path, (err, files) => {
            if(err) throw err;
            for(const file of files) {
                if(filename.includes(file)) {
                    console.log(file);
                    const filepath = join(path,file);
                    fs.unlink(filepath, (err) => {
                        if(err) throw err;
                    })
                }
            }
        })
        */
        /*
        for(const file of await fs.readdir(path)) {
            await fs.unlink(path.join(path, file))
        }
        */
        /*
        
        */
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id:number, @Body() product:any) {
        return this.productService.updateOne(id, product);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id', ParseIntPipe) id:number) {
        return this.productService.deleteOne(id);
    }
    
}
