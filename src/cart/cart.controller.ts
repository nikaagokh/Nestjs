import { Controller, Param, ParseIntPipe, Post, UseGuards, Request, Body, HttpException, HttpStatus, Get, Put, Delete } from '@nestjs/common';
import { CartService } from './service/cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('cart')
export class CartController {
    constructor(private cartService:CartService) {}

    @UseGuards(JwtAuthGuard)
    @Put('add/:id')
    addOne(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        const id = req.user.id;
        return this.cartService.addOne(prodId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('remove/:id')
    removeOne(@Param('id', ParseIntPipe) prodId:number, @Request() req) {
        const id = req.user.id;
        return this.cartService.removeOne(prodId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('multiple')
    manageMultipleAddOrRemove(@Body() body:any, @Request() req) {
        const id = req.user.id;
        const qt = body.quantity;
        const prodId = body.prodId;
        if(qt < 0) throw new HttpException('quantity must be more than 0', HttpStatus.BAD_REQUEST);
        return this.cartService.manageMultipleAddOrRemove(prodId, qt, id);
       
    }

    @UseGuards(JwtAuthGuard)
    @Delete('clear')
    clearCart(@Request() req) {
        const id = req.user.id;
        return this.cartService.clearCart(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('quantity')
    getQuantity(@Request() req) {
        const id = req.user.id;
        return this.cartService.getQuantity(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('count')
    getProductCounts(@Request() req) {
        const id = req.user.id;
        return this.cartService.getProductCounts(id);
    }


}
