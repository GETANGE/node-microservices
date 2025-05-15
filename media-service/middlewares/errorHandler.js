class APIError extends Error{
    constructor(message, statusCode){
        super(message)

        this.statusCode= statusCode,
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
        this.name = 'APIError'
    }
}

export const errorHandler = (err, req, res, next) => {
    // logger.error(err.stack);

    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || "Internal Server Error"
    });
};

export const asyncHandler = (fn) =>(req, res, next)=>{
    Promise.resolve(fn(req, res, next)).catch(next)
}

export { APIError }