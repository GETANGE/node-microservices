import { logger } from "../utils/logger.js"

class APIError extends Error{
    constructor(message, statusCode){
        super(message)

        this.statusCode= statusCode,
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
        this.name = 'APIError'
    }
}

const errorHandler = (err, res, req, next) =>{
    logger.error(err.stack)

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
}

const asyncHandler = (fn) =>(req, res, next)=>{
    Promise.resolve(fn(req, res, next)).catch(next)
}

export { errorHandler, asyncHandler, APIError }