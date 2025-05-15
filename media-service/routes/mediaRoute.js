import express from "express";
import multer from "multer";
import { uploadMedia , getAllMedia} from "../controllers/mediaController.js";
import { authenticateRequest } from "../middlewares/authMiddleware.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single("file");

router.post("/upload", authenticateRequest, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error(`Multer error: ${err.message}`);
            return res.status(400).json({
                status: "fail",
                message: "Multer error while uploading",
                error: err.message
            });
        } else if (err) {
            logger.error(`Unknown error while uploading: ${err.message}`);
            return res.status(500).json({
                status: "fail",
                message: "Unknown error occurred while uploading",
                error: err.message
            });
        } else if (!req.file) {
            logger.error(`No file found in the request`);
            return res.status(400).json({
                status: "fail",
                message: "No file found"
            });
        }

        next(); // continue to controller
    });
}, uploadMedia);

router.get("/", authenticateRequest, getAllMedia)

export default router;
