import express from "express"
import { login, logoutUser, UserRefreshToken, userRegistration } from "../controllers/identity-controller.js";

const router = express.Router()

router.post('/register', userRegistration)
router.post('/login', login)
router.post('/refresh-token', UserRefreshToken)
router.post('/logout', logoutUser)

export default router;