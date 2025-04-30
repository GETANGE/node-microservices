import rateLimit from "express-rate-limit";

const createBasicRateLimter = (maxRequests, time) => {
    return rateLimit({
        max: maxRequests,
        windowMs: time,
        message: { error: 'Too many requests, please try again later'},
        standardHeaders: true,
        legacyHeaders: false
    })
}

export { createBasicRateLimter }