import jwt from "jsonwebtoken"
import crypto from "crypto"
import dotenv from "dotenv"
import { RefreshToken } from "../models/refreshTokenModel.js"

dotenv.config()

const generateToken = async(user)=>{
    const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn : '15m'})

    const refreshToken = crypto.randomBytes(40).toString('hex')

    const expiresAt = new Date().setDate(expiresAt.getDate() + 7)    // refresh token expires in 7 days

    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt: expiresAt
    })

    return { accessToken, refreshToken}
}

export { generateToken }