import express from "express"
import dotenv from "dotenv"
import Redis from "ioredis"
import helmet from "helmet"
import proxy from "express-http-proxy"
import configureCors from "./../config/cors-config.js"
import { logger } from "../src/utils/logger.js"
import { rateLimit } from "express-rate-limit"
import { RedisStore } from "rate-limit-redis"
import { APIError, errorHandler } from "../src/middleware/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const redisClient = new Redis(process.env.REDIS_URL)

app.use(helmet())
app.use(configureCors())
app.use(express.json())

// Rate limiting
const ratelimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`)
    return next(new APIError(`Too many requests`, 429))
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
})

app.use(ratelimit)

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`)
  logger.info(`Request body: ${JSON.stringify(req.body)}`)
  next()
})

// Proxy for Identity-service
app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1/, "/api"),

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json"
      return proxyReqOpts
    },

    proxyErrorHandler: (err, res, next) => {
      logger.error(`Proxy error: ${err.message}`)
      return next(new APIError(`Internal server error: ${err.message}`, 500))
    },

    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from identity service: ${proxyRes.statusCode}`)
      return proxyResData
    },
  })
)

// Global error handler
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port: ${PORT}`)
  logger.info(`Identity Service URL: ${process.env.IDENTITY_SERVICE_URL}`)
  logger.info(`Redis URL: ${process.env.REDIS_URL}`)
})
