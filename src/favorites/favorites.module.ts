import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './model/favorites.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './service/favorites.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Favorites])
    ],
    controllers:[FavoritesController],
    providers:[FavoritesService]
})
export class FavoritesModule {}
