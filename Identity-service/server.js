import dotenv from "dotenv"
import mongoose from "mongoose";
import { RateLimiterRedis } from "rate-limiter-flexible"
import { rateLimit } from "express-rate-limit"
import { RedisStore } from "rate-limit-redis"
import { logger } from "./utils/logger.js"
import express from "express"
import helmet from "helmet"
import Redis from "ioredis"
import configureCors from "./config/cors-config.js";
import { APIError, errorHandler } from "./middleware/errorHandler.js";
import userRoute from "./routes/identity-service-route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 4000

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>logger.info(`Connected to mongoDB`))
    .catch((err) => logger.error(`Mongo connection error`, err))

const redisClient = new Redis(process.env.REDIS_URL)

// middleware
app.use(helmet())
app.use(configureCors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${JSON.stringify(req.body)}`);
    next()
})

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to the root URL - Version 1.0.0",
    });
  });

// DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1
})

app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            logger.warn(`Global rate limit exceeded for IP: ${req.ip}`)
            return next(new APIError(`Too many requests`, 429))
        })
})

// Ip based rate limiting for sensitive endpoints
const sensitiveEndpointsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler : (req, res , next) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`)
        return next(new APIError(`Too many request`, 429))
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})

// apply sensitiveEndpointsLimiter to our endpoints
app.use("/api/auth/register", sensitiveEndpointsLimiter)
app.use("/api/auth/login", sensitiveEndpointsLimiter)

app.use('/api/auth', userRoute)

app.use(errorHandler);


app.listen(PORT, ()=>{
    logger.info(`Identity service running on port: ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason)
})