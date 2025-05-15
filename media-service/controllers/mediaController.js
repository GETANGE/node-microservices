import { logger } from "./../utils/logger.js"
import { APIError, asyncHandler } from "./../middlewares/errorHandler.js"
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import { Media } from "./../models/media.js"

export const uploadMedia = asyncHandler(async (req, res, next) => {
    logger.info(`Starting uploading media...`);

    if (!req.file) {
        logger.error(`No file found. Please add a file and try again!`);
        return next(new APIError(`No file found. Please add a file and try again`, 400));
    }

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name=${originalname}, type=${mimetype}`);
    logger.info(`Uploading to Cloudinary starting...`);

    let cloudinaryUploadResult;
    
    try {
        cloudinaryUploadResult = await uploadMediaToCloudinary(req.file); // Should use correct SDK
    } catch (err) {
        logger.error("Cloudinary upload failed", err);
        console.log(err)
        return next(new APIError("Failed to upload media", 500));
    }

    logger.info(`Cloudinary upload successful. Public Id: ${cloudinaryUploadResult.public_id}`);

    const newlyCreatedMedia = new Media({
        publicId: cloudinaryUploadResult.public_id,
        originalName: originalname,
        mimeType: mimetype,
        url: cloudinaryUploadResult.secure_url,
        userId: userId
    });

    await newlyCreatedMedia.save();

    res.status(201).json({
        status: "success",
        message: "Media upload is successful",
        mediaId: newlyCreatedMedia._id,
        url: newlyCreatedMedia.url
    });
});

export const getAllMedia = asyncHandler(async(req, res, next)=>{
    const result = await Media.find({});

    res.status(200).json({
        status:"success",
        data: result
    })
})