import { logger } from "./../utils/logger.js"
import { APIError, asyncHandler } from "./../middlewares/errorHandler.js"
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import { Media } from "./../models/media.js"

export const uploadMedia = asyncHandler(async(req, res, next)=>{
    logger.info(`Starting uploading media...`);

    if(!req.file){
        logger.error(`No file found. Please add a file and try again!`)
        return next(new APIError(`No file found. Please add a file and try again`, 400));
    }

    const { originalName, mimeType, buffer } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name=${originalName}, type=${mimeType}`);
    logger.info(`Uploading to cloudinary starting...`)

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(`Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`)

    const newlyCreatedMedia = new Media({
        publicId: cloudinaryUploadResult.public_id,
        originalName: originalName,
        mimeType:mimeType,
        url: cloudinaryUploadResult.secure_url,
        userId:userId
    })

    await newlyCreatedMedia.save();

    res.status(201).json({
        status:"success",
        message:"Media upload is successful",
        mediaId: newlyCreatedMedia._id,
        url: newlyCreatedMedia.url
    })
})