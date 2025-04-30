import express from "express";
import dotenv from "dotenv";
import configureCors from "./config/corsConfig.js"
import { requestLogger, addTimestamp } from "./middleware/customMiddleware.js"
import { globalErrorHandler } from "./middleware/errorHandler.js"
import { urlVersioning } from "./middleware/apiVersioning.js";
import { createBasicRateLimter } from "./middleware/rateLimitting.js"
import { testRedisConnection } from "./config/redisConfig.js";
import itemRoute from "./routes/item-route.js"

dotenv.config()

const app = express();

const PORT = process.env.PORT || 4000;

app.use(requestLogger);
app.use(addTimestamp);

app.use(configureCors());
app.use(createBasicRateLimter(100, 15*60*100))
app.use(express.json());
app.use(testRedisConnection)

app.use(urlVersioning('v1'));
app.use('/api/v1/', itemRoute);

app.use(globalErrorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})