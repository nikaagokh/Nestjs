import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser.guard';

@Controller('comments')
export class CommentsController {
    constructor(private commentService:CommentService) {}
    @UseGuards(JwtAuthGuard)
    @Get('user')
    getAllCommentsByUser(@Request() req) {
        const id = req.user.id;
        return this.commentService.getAllCommentsByUser(1)
    }

    
    @Get('all/post/:id')
    getAllCommentsWithLikesAndAuthors(@Param('id', ParseIntPipe) prodId:number) {
        return this.commentService.getAllCommentsWithLikesAndAuthors(1, prodId);
    }
   

    @UseGuards(JwtAuthGuard)
    @Get('liked/post/:id')
    getAllLikedCommentsByUser(@Request() req, @Param('id', ParseIntPipe) prodId:number) {
        const id = req.user.id;
        return this.commentService.getAllLikedCommentsByUser(1, prodId);
    }

    @Get('top/post/:id')
    getTopCommentOnPost(@Param('id', ParseIntPipe) id:number) {
        return this.commentService.getTopCommentOnPost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('react/comment/:id')
    getAllReactionsOnComment(@Request() req, @Param('id', ParseIntPipe) commid:number) {
        const id = req.user.id;
        return this.commentService.getAllReactionsOnComment(commid);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add/comment')
    addOne(@Body() body:any, @Request() req) {
        const id = req.user.id;
        const comm = body.comment;
        const prodId = body.prodId;
        return this.commentService.addOne(comm, id, prodId)
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Post('modify/comment')
    updateOne(@Body() body:any, @Request() req) {
        const id = req.user.id;
        const comm = body.comment;
        const prodId = body.prodId;
        return this.commentService.updateOne(comm, 1, prodId)
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Post('delete/comment')
    deleteOne(@Request() req, @Body() body:any) {
        const id = req.user.id;
        const prodId = body.prodId;
        const commId = body.commId;
        return this.commentService.deleteOne(1, prodId, commId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('react')
    manageReaction(@Body() body:any, @Request() req) {
        //const userId = req.user.id;
        const commId = body.commId;
        const typeId = body.typeId;
        return this.commentService.manageReaction(commId, typeId, 1);
    }




}
