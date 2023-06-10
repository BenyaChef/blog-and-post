import {body} from "express-validator";
import {ERRORS_MESSAGE} from "../enum/errors-validation-messages";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {ObjectId} from "mongodb";
import {usersCollections} from "../db/db";


const patternUrl = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
const patternObjectId = '^[0-9a-fA-F]{24}$'

const loginOrEmailValidationRule = body('loginOrEmail')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)


const passwordValidationRule = body('password')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const loginValidationRule = body('login')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 10}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches('^[a-zA-Z0-9_-]*$').withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const emailValidationRule = body('email')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const nameValidationRule = body('name')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 15}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const descriptionValidationRule = body('description')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 500}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const websiteUrlValidationRule = body('websiteUrl')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches(patternUrl).withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const titleValidationRule = body('title')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const shortDescriptionValidationRule = body('shortDescription')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const contentValidationRule = body('content')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 1000}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const blogIdValidationRule = body('blogId')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .matches(patternObjectId).withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)
    .custom(async value => {
        if (ObjectId.isValid(value)) {
            const isFind = await blogsQueryRepository.findBlogByID(value)
            if (!isFind) {
                throw new Error(ERRORS_MESSAGE.NOT_FOUND)
            }
        }
    })

const commentsValidationRule = body('content')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 20 , max: 300}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const codeValidationRule = body('code')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)

const registrationUserEmailValidationRule = body('email')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)
    .custom(async email => {
        const user = await usersCollections.findOne({email: email})
        if(user) {
            throw new Error(ERRORS_MESSAGE.FOUND)
        }
    })

const registrationUserLoginValidationRule = body('login')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 10}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches('^[a-zA-Z0-9_-]*$').withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)
    .custom(async login => {
       const user = await usersCollections.findOne({login: login})
        if(user) {
            throw new Error(ERRORS_MESSAGE.FOUND)
        }
    } )

export const authValidationMiddleware = [loginOrEmailValidationRule, passwordValidationRule]
export const userAdminValidationMiddleware = [loginValidationRule, passwordValidationRule, emailValidationRule]
export const userValidationMiddleware = [registrationUserEmailValidationRule, registrationUserLoginValidationRule, passwordValidationRule]
export const blogValidationMiddleware = [nameValidationRule, descriptionValidationRule, websiteUrlValidationRule]
export const postValidationMiddleware = [titleValidationRule, shortDescriptionValidationRule, contentValidationRule, blogIdValidationRule]
export const postByBlogValidationMiddleware = [titleValidationRule, shortDescriptionValidationRule, contentValidationRule]
export const commentsValidationMiddleware = [commentsValidationRule]
export const codeValidationMiddleware = [codeValidationRule]
export const emailValidationMiddleware = [emailValidationRule]