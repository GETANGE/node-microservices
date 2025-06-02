import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { rateLimiter } from "hono-rate-limiter"
import { logger } from "hono/logger"
import { RedisStore } from "rate-limit-redis"
import mongoose from "mongoose";
import Redis from "ioredis"

import dotenv from "dotenv"
import configureCors from "./config/cors-config.js";
import notifeeRoute from "./routes/notifee-route.js";

dotenv.config();

const app = new Hono()
const PORT = process.env.NOTIFEE_PORT ?? 5005;

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log(`MongoDB connected`))
    .catch((err)=> console.log(`Error connecting to the Database : ${err}`))

const redisClient = new Redis(process.env.REDIS_URL);

app.use(logger())
app.use(configureCors());

app.use((c, next) => {
  console.log(`Received ${c.req.method} request to ${c.req.url}`)

  return next()
})

app.get('/', (c) => {
  return c.json({
        status: "success",
        message: 'Welcome to the notification-service root URL - Version 1.0.0'
  })
})

// Ip based rate limiting for senstive endpoints
app.use("*", rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit : 50,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.raw.headers.get('x-real-ip') || c.req.raw.headers.get('cf-connecting-ip') || c.req.raw.headers.get('x-client-ip') || c.req.raw.headers.get('x-forwarded') || c.req.raw.headers.get('x-cluster-client-ip') || c.req.ip,
  store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args)
  })
}))

app.get("/api/notifee", notifeeRoute);

app.notFound((c)=>{
    return c.json({ message: `This route ${c.req.method} is not yet handled`})
})

app.onError((err, c) => {
    return c.json({ errorMessage: `App Error: ${err.message}`}, 500)
})

serve({
    fetch: app.fetch,
    port: PORT
})

console.log(`Hono is running on http://localhost:${PORT}`);