import { Body, Controller, Get, Post, UseGuards, Request, Param, ParseIntPipe, Req, Put, Delete } from '@nestjs/common';
import { RatingService } from './service/rating.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('rating')
export class RatingController {
    constructor(private ratingService:RatingService) {}

    @UseGuards(JwtAuthGuard)
    @Post('add')
    manageRating(@Body() body:any, @Request() req) {
        const id = req.user.id;
        const rate = body.rate;
        const prodId = body.prodId;
        return this.ratingService.manageRating(id,prodId, rate);
    }

    //@UseGuards(JwtAuthGuard)
    @Get('product/:id')
    getAllRatingsOfProduct(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        //const id = req.user.id;
        return this.ratingService.getAllRatingsOfProduct(1, prodId);
    }
    
    //@UseGuards(JwtAuthGuard)
    @Get('user/all')
    getAllRatingsByUser(@Request() req) {
        //const id = req.user.id;
        return this.ratingService.getAllRatingsByUser(1);
    }
    
    //@UseGuards(JwtAuthGuard)
    @Get('user/:id')
    getRatingByUserOfProduct(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        //const id = req.user.id;
        return this.ratingService.getRatingByUserOfProduct(1, prodId);
    }
    
    //@UseGuards(JwtAuthGuard)
    @Get('average/:id')
    getAverageRatingOfProduct(@Param('id', ParseIntPipe) prodId:number) {
        return this.ratingService.getAverageRatingOfProduct(prodId);
    }
    
    //@UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    deleteProductRating(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        //const id = req.user.id;
        return this.ratingService.deleteProductRating(1, prodId);
    }
        
    
}
