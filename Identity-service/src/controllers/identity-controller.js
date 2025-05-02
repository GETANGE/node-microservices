import { APIError, asyncHandler } from "../middleware/errorHandler.js"
import { User } from "../models/userModel.js"
import { generateToken } from "../utils/generateToken.js"
import { logger } from "../utils/logger.js"
import { validateRegistration } from "../utils/validation.js"

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

// refresh token

// logout