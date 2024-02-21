import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './model/comments.entity';
import { ReactComment } from 'src/reactcomment/model/reactcomment.entity';
import { CommentsController } from './comments.controller';
import { CommentService } from './service/comment.service';
import { ReviewProduct } from 'src/review/model/review.entity';
import { UserModule } from 'src/user/user.module';


@Module({
    imports:[
        TypeOrmModule.forFeature([Comment, ReactComment, ReviewProduct]),
        UserModule
    ],
    controllers:[CommentsController],
    providers:[CommentService],
    exports:[CommentService]
    
})
export class CommentsModule {}
