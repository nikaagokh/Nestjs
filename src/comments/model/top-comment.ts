import { Comment } from "./comments.entity";

export interface TopComment {
    comments?:Comment[];
    top?:Comment;
}