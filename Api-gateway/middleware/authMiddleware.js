import { APIError } from "./errorHandler.js"
import { logger } from "./../utils/logger.js"
import jwt from "jsonwebtoken"


export const validateToken = (req, res, next)=>{
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1]

    if(!token){
        logger.warn(`Access atemp without a valid token`)
        return next(new APIError(`Authentication required`, 401))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            logger.warn('Invalid Token')
            return next(new APIError(`Invalid Token`, 429))
        }

        req.user = user
        next()
    })
}