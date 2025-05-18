import amqp from "amqplib"
import dotenv from "dotenv"
import { logger } from "./logger.js"

dotenv.config()

let connection = null;
let channel = null;

const EXCHANGE_NAME= 'facebook_events'

export const connectToRabbitMQ = async()=>{
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        logger.info(`Connected to RabbitMQ`)

        return channel;
    } catch (error) {
        logger.error(`Error connceting to RabbitMQ`, error)
    }
}

export const publishEvent = async(routingKey, message)=>{
    try {
        if(!channel){
            await connectToRabbitMQ()
        }

        channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
        logger.info(`Event published: ${routingKey}`)
    } catch (error) {
        logger.error(`Error publishing an Event`, error)
    }
}