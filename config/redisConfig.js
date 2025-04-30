import redis from "redis";

const client = redis.createClient({
    host: 'localhost',
    port: 6380,
})

client.on('error',(err)=>{
    console.log("Redis client error", err)
})

async function testRedisConnection(){
    try {
        await client.connect()
        console.log("Redis connected")
    } catch (error) {
        console.error(error)
    }finally{
        await client.quit()
    }
}
testRedisConnection()

export { testRedisConnection }