import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './model/rating.entity';
import { UserModule } from 'src/user/user.module';
import { RatingController } from './rating.controller';
import { RatingService } from './service/rating.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([Rating]),
        UserModule
    ],
    controllers:[RatingController],
    providers:[RatingService]
})
export class RatingModule {}
