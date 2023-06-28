import {ObjectId, WithId} from "mongodb";
import {InputCommentModel} from "../models/comment-models/input-coment-model";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {CommentClass} from "../classes/comment-class";

class CommentsService {
    async createNewComment(body: InputCommentModel, userId: ObjectId, postId: string) : Promise<ObjectId | null> {
        const user: WithId<AdminDbModel> | null = await usersQueryRepository.findUserById(userId)
        if(!user) {
            return null
        }
        const post = await postsQueryRepository.findPostByID(postId)
        if(!post) {
            return null
        }
        const userDto = {
            userId: user._id.toString(),
            userLogin: user.login
        }
        const newComment: CommentDbModel = new CommentClass(body.content, userDto, postId)
        return await commentsRepository.createNewComment(newComment)
    }

    async updateComments(body: InputCommentModel, userId: ObjectId, commentId: string) : Promise<ResultCodeHandler<null>> {
        const findComment = await commentsRepository.findCommentById(commentId)
        if(!findComment) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if(userId.toString() !== findComment.commentatorInfo.userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const updateComment = {content: body.content}
        const resultUpdate = await commentsRepository.updateCommentById(updateComment, commentId)
        if(!resultUpdate) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }

    async deleteComment(id: string, userId: ObjectId) : Promise<ResultCodeHandler<null>> {
        const findComment = await commentsQueryRepository.findCommentById(id)
        if(!findComment) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if(userId.toString() !== findComment.commentatorInfo.userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const resultDelete = commentsRepository.deleteComment(findComment.id!)
        if(!resultDelete) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }
}

export const commentsService = new CommentsService()