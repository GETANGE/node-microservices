import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import Redis from "ioredis"
import helmet from "helmet"
import { RateLimiterRedis } from "rate-limiter-flexible"
import { rateLimit } from "express-rate-limit"
import { RedisStore } from "rate-limit-redis"

import searchRoute from "./routes/search-route.js"
import {errorHandler} from "./middlewares/errorHandler.js"
import { searchEventHandler, handlePostDeleted } from "./eventHandlers/search-event.handler.js"
import configureCors from "./config/cors-config.js";
import {logger} from "./utils/logger.js"
import { connectToRabbitMQ, consumeEvent } from "./utils/rabbitMQ.js"
import createServer from "./utils/mkServer.js"

const app = createServer();
const PORT = process.env.PORT || 5004
dotenv.config()

// connect to mongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> logger.info(`Connected to mongodb`))
    .catch((error)=> logger.error(`Mongo connection error`, error))

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
      message: "Welcome to the search-service root URL - Version 1.0.0",
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
app.use("/api/search/search-post", sensitiveEndpointsLimiter)

app.use('/api/search', searchRoute)

app.use(errorHandler);

async function startServer(){
    try {
        await connectToRabbitMQ()

        //subscribe to the event
        await consumeEvent('post.created', searchEventHandler);
        await consumeEvent('post.deleted', handlePostDeleted)
        app.listen(PORT, ()=>{
            logger.info(`Search service running on port: ${PORT}`)
        })
    } catch (error) {
        logger.error(`Failed to connect to server`, error);
        process.exit(1);
    }
}
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason)
})