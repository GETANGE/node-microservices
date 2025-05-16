import { Media } from "../models/media";
import { deleteMediaFromCloudinary } from "../utils/cloudinary";
import { logger } from "../utils/logger.js"

// events being handled
export const handlePostDeleted = async (event)=>{
    console.log(event, "eventevent")

     const { postId, mediaIds } = event;

     try {
        const mediaToDelete = await Media.find({_id: {$in: mediaIds}})

        for( const media of mediaToDelete){
            await deleteMediaFromCloudinary(media.publicId)
            await Media.findByIdAndDelete(media._id)

            logger.info(`Deleted media ${media._id} associated with this postId: ${postId}`)
        }
     } catch (error) {
        logger.error(`Error occured while deleting media`, error)
     }
}