import {Router} from "express";
import {commentController} from "../controller/comment-controller";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";
import {commentsValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    idValidationMiddleware,
    commentController.getCommentById)

commentsRouter.put('/:id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentsValidationMiddleware,
    inputValidationMiddleware,
    commentController.updateCommentById)

commentsRouter.delete('/id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentController.deleteCommentByID)