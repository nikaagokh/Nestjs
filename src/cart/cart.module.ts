import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './model/cart.entity';
import { CartService } from './service/cart.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Cart])
  ],
  controllers: [CartController],
  providers:[CartService]
})
export class CartModule {}
