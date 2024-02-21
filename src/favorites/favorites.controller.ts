import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { FavoritesService } from './service/favorites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';



@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService:FavoritesService) {}

    @UseGuards(JwtAuthGuard)
    @Post('manage/:id')
    manageFavorites(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        const id = req.user.id;
        return this.favoritesService.manageFavorites(prodId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete')
    clearFavoritesOfUser(@Request() req) {
        const id = req.user.id;
        return this.favoritesService.clearFavoritesOfUser(1);
    }

    @UseGuards(JwtAuthGuard)
    @Get('product/:id')
    checkIfFavorite(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        const id = req.user.id;
        return this.favoritesService.checkIfFavorite(id, prodId);
    }
    
    
}
