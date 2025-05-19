import { APIError, asyncHandler } from "../middlewares/errorHandler.js";
import { Search } from "./../models/search.js"
import { logger } from "./../utils/logger.js"

export const searchPostController = asyncHandler(async(req, res, next)=>{
    logger.info(`Search endpoint hit...`)

    try {
        const { query } = req.query;

        const results = await Search.find(
            { $text: { $search: query}},
            { $score: { $meta: "textScore"}},
        )
        .sort( { $score : { $meta: "textScore"}})
        .limit(10);

        if(!results) return next(new APIError(`No search found`, 404))

        res.status(200).json({
            status:"success",
            data: results
        })
    } catch (error) {
        logger.error(`Internal server error`, error);
        return next(new APIError(`Internal server error`, 500))
    }
})