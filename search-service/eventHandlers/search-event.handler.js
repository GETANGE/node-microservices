import { Search } from "../models/search.js";
import { logger } from "./../utils/logger.js"

export const searchEventHandler =async (event)=>{
    try {
        const { postId, userId, content, createdAt } = event;

        const newSearchPost = new Search({ postId, userId, content, createdAt });

        await newSearchPost.save();
        logger.info(`Search post created: ${postId}, ${newSearchPost._id.toString()}`)
    } catch (error) {
        logger.error(`Error while searching for a post`)
    }
}

export const handlePostDeleted = async (event)=>{

     const { postId } = event;

     try {
        await Search.findByIdAndDelete({ postId })
        logger.info(`Search post deleted: ${postId}`)
     } catch (error) {
        logger.error(`Error occured while deleting post event`, error)
     }
}