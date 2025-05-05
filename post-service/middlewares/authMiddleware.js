import {logger} from "./../utils/logger.js"
import { APIError, asyncHandler } from "./errorHandler.js"

const authenticateRequest = asyncHandler( async(req, res, next)=>{
    const userId = req.headers['x-user-id']

    if(!userId){
        logger.warn(`Access attempted without userId`)
        return next(new APIError(`Authentication required! Please login to continue`, 401))
    }

    req.user = { userId }

    next()
})

export { authenticateRequest }