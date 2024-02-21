import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../model/comments.entity";
import { EntityManager, Repository } from "typeorm";
import { ReactComment } from "src/reactcomment/model/reactcomment.entity";
import { ReviewProduct } from "src/review/model/review.entity";
import { User } from "src/user/model/user.entity";
import { TopComment } from "../model/top-comment";
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private commRepo:Repository<Comment>,
        @InjectRepository(ReviewProduct) private reviewRepo:Repository<ReviewProduct>,
        @InjectRepository(ReactComment) private reactRepo:Repository<ReactComment>,
        private entityManager:EntityManager
    ) {}

    async getAllCommentsByUser(id:number) {
        return await this.commRepo.createQueryBuilder('comm')
        .leftJoin('comm.review', 'review')
        .where(`review.userId = ${id}`)
        .getMany();
    }

    async getAllLikedCommentsByUser(id:number, prodId:number) {
        return await this.commRepo.createQueryBuilder('comm')
        .leftJoin('comm.review', 'review')
        .leftJoin('comm.react', 'react')
        .where(`review.productId = ${prodId}`)
        .andWhere(`react.userId = ${id}`)
        //`review.productId = ${prodId}`
        .getMany();
    }

    async getAllReactionsOnComment(commId:number) {
        const comm = await this.commRepo.createQueryBuilder('comm')
        .leftJoinAndSelect('comm.react', 'react')
        .leftJoinAndSelect('react.type', 'type')
        .leftJoinAndSelect('react.user', 'user')
        .where(`comm.id = ${commId}`)
        .getMany();
        return this.MiniMapper(comm)

    }

    async getAllCommentsWithLikesAndAuthors(id:number, prodId:number) {
        const comm = await this.commRepo.createQueryBuilder('comm')
        .leftJoinAndSelect('comm.review', 'review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('comm.react', 'react')
        .leftJoinAndSelect('react.type', 'type')
        .leftJoinAndSelect('react.user', 'userlike')
        .addSelect('count(react.id)', 'comm_likesCount')
        .groupBy('comm.id')
        .orderBy('comm_likesCount', 'DESC')
        .where(`review.productId = ${prodId}`)
        .getMany();
        return this.Mapper(comm,id);
    }
    
    

    async addOne(comment:string, userId:number, prodId:number) {
        const commByUser = await this.reviewRepo.createQueryBuilder('rew').where(`rew.userId = ${userId} and rew.productId = ${prodId}`).getOne();
        if(!commByUser) return new HttpException('comment already exists', HttpStatus.BAD_REQUEST);
        const comm = new Comment();
        comm.comment = comment;
        await this.commRepo.save(comm).then((comm) => {
            const review = new ReviewProduct();
            review.comment = comm;
            review.userId = userId;
            review.productId = prodId
            return this.addReview(review);
        })

    }
    

    async updateOne(comment:string, userId:number, prodId:number) {
        const commByUser = await this.reviewRepo.createQueryBuilder('rew').where(`rew.userId = ${userId} and rew.productId = ${prodId}`).getOne();
        if(!commByUser) return new HttpException('comment not exist', HttpStatus.BAD_REQUEST);
        const comm = await this.commRepo.createQueryBuilder('comm').where(`comm.id = ${commByUser.commentId}`).getOne();
        comm.comment =comment;
        return await this.commRepo.save(comm);
    }

    async deleteOne(userId:number, prodId:number, commId:number) {
        const commByUser = await this.reviewRepo.createQueryBuilder('rew').where(`rew.userId = ${userId} and rew.productId = ${prodId}`).getOne();
        if(!commByUser) return new HttpException('comment not exist', HttpStatus.BAD_REQUEST);
        const comm = await this.commRepo.createQueryBuilder('comm').where(`comm.id = ${commByUser.commentId}`).getOne();
        if(comm) return await this.commRepo.remove(comm);
    }

    async manageReaction(commId:number, typeId:number, userId:number) {
        const commByUser = await this.reviewRepo.createQueryBuilder('rew').where(`rew.commentId = ${commId}`).getOne();
        if(!commByUser) return new HttpException('comment not exist', HttpStatus.BAD_REQUEST);
        const comm = await this.commRepo.createQueryBuilder('comm').where(`comm.id = ${commByUser.commentId}`).getOne();
        const alreadyLiked = await this.reactRepo.createQueryBuilder('react').where(`react.userId = ${userId} and react.commentId = ${comm.id} and react.typeId = ${typeId}`).getOne();
        if(alreadyLiked && alreadyLiked.typeId === typeId) {
            return await this.deleteReaction(alreadyLiked);
        } else if (alreadyLiked && alreadyLiked.typeId !== typeId) {
            return await this.updateReaction(alreadyLiked, typeId);
        }
        else if (!alreadyLiked) {
            return await this.addReaction(comm.id, typeId, userId)
        }
    }
    

    async addRandomComments() {
        const comms = await this.commRepo.createQueryBuilder('comm').where('comm.id > 6').getMany();
        let rews:ReviewProduct[] = [];
        comms.map((com, i) => {
            const rew = new ReviewProduct();
            rew.comment = com;
            rew.userId = (i % 3) + 1;
            if(i > 10) {
                rew.productId = 11;
            } else {
                rew.productId = 12;
            }
            rews.push(rew);
        })
        return await this.reviewRepo.save(rews);
        
    }

    async topComment(prodId:number) {
        const comm = await this.commRepo.createQueryBuilder('comm')
        .leftJoin('comm.review', 'review')
        .leftJoinAndSelect('comm.react', 'react')
        .where('review.productId in (12,14,15,16)')
        .groupBy()
        .getMany();
    }

    async getTopCommentOnPost(prodId:number) {
        const comm = await this.commRepo.createQueryBuilder('comment')
        .leftJoin('comment.react', 'reaction')
        .addSelect('count(reaction.id)', 'comment_likesCount')
        .groupBy('comment.id')
        .orderBy('comment_likesCount', 'DESC')
        .limit(1)
        .getMany()
        return comm;
        return comm;
    }

    private async addReview(review:ReviewProduct) {
        return await this.reviewRepo.save(review);
    }

    private async updateReaction(liked:ReactComment, typeId:number) {
        liked.typeId = typeId;
        return await this.reactRepo.save(liked);
    }

    private async addReaction(commId:number, typeId:number, userId:number) {
        const react = new ReactComment();
        react.commentId = commId;
        react.typeId = typeId;
        react.userId = userId;
        return await this.reactRepo.save(react);
    }
    private async deleteReaction(liked:ReactComment) {
        return await this.reactRepo.remove(liked);
    }

    private Mapper(comm:Comment[], id:number) {
        const top:TopComment = {};
        let maxId = 0;
        comm.map((comm) => {
            const {user} = comm.review;
            delete comm.review
            comm.user = user;
            comm.likes = [];
            comm.unlikes = [];
            comm.react.map((react) => {
                delete react.id;
                delete react.commentId;
                delete react.typeId;
                delete react.userId;
                if(react.type.id === 1) {
                    comm.likes.push(react.user)
                }
                if(react.type.id === 2) {
                    comm.unlikes.push(react.user)
                }
                if(react.userId === id) {
                    comm.reacted = react.type
                    
                }
                
            })
            delete comm.react
            if(comm.likes.length > maxId) {
                maxId = comm.id;
            }
        })
        top.comments = comm;
        top.top = comm[maxId];
        return top;
    }

    private MiniMapper(comm:Comment[]) {
        comm.map((comm) => {
            comm.likes = [];
            comm.unlikes = [];
            comm.react.map((react) => {
                delete react.id;
                delete react.commentId;
                delete react.typeId;
                delete react.userId;
                if(react.type.id === 1) {
                    comm.likes.push(react.user)
                }
                if(react.type.id === 2) {
                    comm.unlikes.push(react.user)
                }
               
                
                
            })
            delete comm.react
        })
        return comm
    }
    
}