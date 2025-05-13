import { APIError, asyncHandler } from "../middlewares/errorHandler.js";
import { Post } from "../models/post.js";
import { validateContent } from "../utils/validation.js";
import { logger } from "./../utils/logger.js";

// invalidate redis cache
async function invalidatePostCache(req, input){
    const cachedKey = `post:${input}`
    await req.redisClient.del(cachedKey)

    const keys = await req.redisClient.keys("posts:*")
    if(keys.length > 0){
        await req.redisClient.del(keys)
    }
}

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
    logger.info(`Create post endpoint hit...`);

    const { error } = validateContent(req.body);

    if (error) {
        logger.warn(`Validation error`, error.details[0].message);
        return next(new APIError(`Validation error: ${error.details[0].message}`, 401));
    }

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
        user: req.user.userId,
        content: content,
        mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();
    await invalidatePostCache(req, newlyCreatedPost._id.toString())
    logger.info(`Post created successfully`, newlyCreatedPost);

    res.status(201).json({
        status: "success",
        message: "Post created successfully"
    });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res, next) => {
    logger.info(`Fetching all posts...`);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`
    const cachedPosts = await req.redisClient.get(cacheKey)

    if(cachedPosts){
        return res.status(200).json({
            status: "success",
            data: JSON.parse(cachedPosts),
        })
    }

    const posts = await Post.find({}).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    const totalNoOfPosts = await Post.countDocuments();

    const result = {
        posts,
        currentPage: page,
        totalPages: Math.ceil(totalNoOfPosts/limit),
        totalPosts: totalNoOfPosts
    }

    // cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result))

    res.status(200).json({
        status: "success",
        data: result
    });
});

export const singlePost = asyncHandler(async (req, res, next) => {
    logger.info(`Update post endpoint hit...`);

    const { postId } = req.params;

    const cacheKey = `SinglePost:${postId}`
    const cachedPost = await req.redisClient.get(cacheKey)
    if(cachedPost){
        return res.status(200).json({
            status:"success",
            data: JSON.parse(cachedPost)
        })
    }

    const post = await Post.findById(postId);
    if (!post) {
        logger.warn(`Post not found`);
        return next(new APIError("Post not found", 404));
    }

    await req.redisClient.setex(cacheKey, 3600, JSON.stringify(post))

    res.status(200).json({
        status: "success",
        message: "Post updated successfully",
        post
    });
});

// Update a post
export const updatePost = asyncHandler(async (req, res, next) => {
    logger.info(`Update post endpoint hit...`);

    const { postId } = req.params;
    const { content, mediaIds } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        logger.warn(`Post not found`);
        return next(new APIError("Post not found", 404));
    }

    if (post.user.toString() !== req.user.userId) {
        logger.warn(`Unauthorized update attempt`);
        return next(new APIError("You are not authorized to update this post", 403));
    }

    if (content) post.content = content;
    if (mediaIds) post.mediaIds = mediaIds;

    await post.save();
    logger.info(`Post updated successfully`, post);

    // invalidate the post cache
    await invalidatePostCache(req, req.params.id)

    res.status(200).json({
        status: "success",
        message: "Post updated successfully",
        post
    });
});

// Delete a post
export const deletePost = asyncHandler(async (req, res, next) => {
    logger.info(`Delete post endpoint hit...`);

    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        logger.warn(`Post not found`);
        return next(new APIError("Post not found", 404));
    }

    if (post.user.toString() !== req.user.userId) {
        logger.warn(`Unauthorized delete attempt`);
        return next(new APIError("You are not authorized to delete this post", 403));
    }

    await post.remove();
    logger.info(`Post deleted successfully`, postId);

    await invalidatePostCache(req, req.params.id)

    res.status(200).json({
        status: "success",
        message: "Post deleted successfully"
    });
});
