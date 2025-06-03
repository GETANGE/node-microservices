import amqp from "amqplib"
import dotenv from "dotenv"

dotenv.config();

let connection = null;
let channel = null;

let EXCHANGE_NAME = "facebook-event"

export const connectToRabbitMQ = async() =>{
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);

        channel= await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: false })
        console.log(`Connected to RabbitMQ`)
    } catch (error) {
        console.log(`Error connecting to RabbitMQ: `, error)
    }
}

// consume
export const consumeEvent = async (routingKey, callback) => {
  try {
    if (!channel) {
      channel = await connectToRabbitMQ();
    }

    const { queue } = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(queue, EXCHANGE_NAME, routingKey); 

    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        callback(content);
        channel.ack(message);
      }
    });

    console.log(`📡 Subscribed to event: ${routingKey}`);
  } catch (error) {
    console.error("❌ Error consuming event:", error);
  }
};