import { APIError, asyncHandler } from "../middleware/errorHandler.js"
import { RefreshToken } from "../models/refreshTokenModel.js"
import { User } from "../models/userModel.js"
import { generateToken } from "../utils/generateToken.js"
import { logger } from "../utils/logger.js"
import { validateRegistration, validateLogin } from "../utils/validation.js"

// user registration
export const userRegistration = asyncHandler(async(req, res, next)=>{
    logger.info(`Registration endpoint hit...`)
    
    const {error } = validateRegistration(req.body);

    if(error){
        logger.warn(`Validation error`, error.details[0].message)
        return next(new APIError(error.details[0].message, 400))
    }

    const { email, username, password }= req.body

    if(!email || !username || !password ){
        return next(new APIError(`Email, username and password are required`, 400))
    }

    let user = await User.findOne({$or : [{ email }, { username }]})

    if(user){
        logger.warn(`User already exists`)
        return next(new APIError(`User already exists`, 400))
    }

    user = new User({username, password, email })

    await user.save()
    logger.warn(`User saved successfully`)
    
    // generate token
    const { accessToken, refreshToken} = await generateToken(user)

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        accessToken,
        refreshToken
    })
})

// user login

export const login = asyncHandler(async(req, res, next)=>{
    logger.info(`Login endpoint hit...`)

    const {error} = validateLogin(req.body);

    if(error){
        logger.warn(`validation error:`, error.details[0].message)
        return next(new APIError(error.details[0].message, 400))
    }

    const {email, password, confirmPassword}=req.body;

    if(!email || !password || !confirmPassword){
        return next(new APIError(`email, password or confirmPassword is required`, 400))
    }

    if(password !== confirmPassword){
        return next(new APIError(`passwords are not the same`, 400))
    }

    const user = await User.findOne({email})

    if(!user){
        logger.warn(`Invalid user`)
        return next(new APIError(`User not found`, 404))
    }

    const isMatch = await user.comparePassword(password)

    if(!isMatch){
        logger.warn(`Invalid password`)
        return next(new APIError(`email or password do not match`, 400))
    }

    const { accessToken, refreshToken} = await generateToken(user)

    res.status(200).json({
        status:"success",
        message:"LoggedIn successfully",
        role: user.role,
        accessToken,
        refreshToken
    })
})

// refresh token
export const UserRefreshToken = asyncHandler(async(req, res, next)=>{
    logger.info(`Refresh token endpoint hit...`)

    const { refreshToken } = req.body;

    if(!refreshToken){
        logger.warn(`Refresh token missing`)
        return next(new APIError(`Refresh token missing`, 400))
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken })

    if(!storedToken || storedToken.expiresAt < new Date()){
        logger.warn(`Refresh token expired ${storedToken}`)
        return next(new APIError(`Invalid or expired refresh token`, 400))
    }

    const user = await User.findById(storedToken.user);

    if(!user){
        return next(new APIError(`User not found`, 400))
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken}= await generateToken()

    await RefreshToken.deleteOne({_id:storedToken._id});

    res.status(200).json({
        status:"success",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    })
})

// logout
export const logoutUser = asyncHandler(async(req, res, next)=>{
    logger.info(`Refresh token endpoint hit...`)

    const { refreshToken } = req.body;

    if(!refreshToken){
        logger.warn(`Refresh token missing`)
        return next(new APIError(`Refresh token missing`, 400))
    }

    await RefreshToken.deletOne({ token: refreshToken })
    logger.info(`Refresh token deleted for logout`)

    res.status(200).json({
        status:"success",
        message: "loggedOut successfully"
    })
})