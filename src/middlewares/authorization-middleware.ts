import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const basic64 = Buffer.from('admin:qwerty').toString('base64')
    const loginData = `Basic ${basic64}`

    if(req.headers.authorization !== loginData) await res.sendStatus(401)

    next()
}
