import express from "express"
import { authenticateRequest } from "../middlewares/authMiddleware.js";
import { createPost, getAllPosts, singlePost } from "../controllers/post-controller.js";
const router = express.Router();

//middleware  -> this will tell if the user is an authenticated user or not
router.use(authenticateRequest)

router.post('/create-post', createPost)
router.get('/', getAllPosts)
router.get('/:postId', singlePost)

export default router;