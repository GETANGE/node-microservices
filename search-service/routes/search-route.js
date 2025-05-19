import express from "express";
import { authenticateRequest } from "./../middlewares/authMiddleware.js"
import { searchPostController } from "../controllers/search-contoller.js";

const router = express.Router();

router.use(authenticateRequest)

router.get("/post", searchPostController)
export default router