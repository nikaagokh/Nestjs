import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { TagProductService } from './service/tag-product.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { hasRoles } from 'src/auth/guards/role.decorator';
import { UserRole } from 'src/user/model/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('tagproduct')
export class TagproductController {
    constructor(private tagProductService:TagProductService) {}

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('add/rel')
    addProductToTag(@Body() body:any) {
        const prodId = body.prodId;
        const tagId = body.tagId;
        return this.tagProductService.addProductToTag(prodId, tagId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('tag/product/:id')
    getAllTagsOfProduct(@Param('id', ParseIntPipe) id:number) {
        return this.tagProductService.getAllTagsOfProduct(id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('update/rel')
    updateProductToTag(@Body() body:any) {
        const prodId = body.prodId;
        const tagId = body.tagId;
        const newTagId = body.newTagId;
        return this.tagProductService.updateProductToTag(prodId, tagId, newTagId);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('delete/rel')
    deleteProductToTag(@Body() body:any) {
        const prodId = body.prodId;
        const tagId = body.tagId;
        return this.tagProductService.deleteProductToTag(prodId, tagId);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('add/tag') 
    addTag(@Body() body:any) {
        const name = body.name;
        const type = body.type;
        return this.tagProductService.addTag(name, type);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('update/tag') 
    updateTag(@Body() body:any) {
        const id = body.name;
        const name = body.name;
        const type = body.type;
        return this.tagProductService.updateTag(id, name, type);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('delete/:id') 
    deleteTag(@Param('id', ParseIntPipe) id:number) {
        return this.tagProductService.deleteTag(id);
    }


}
