import redis from "redis";

const client = redis.createClient({
    host: 'localhost',
    port: 6380,
})

client.on('error',(err)=>{
    console.log("Message-broker error", err)
})

async function testAdditionalFeatures() {
    try {
        await client.connect()
        console.log('Message-broker connected...')

        // create a subscriber
        const subscriber = client.duplicate() // creates a new client => share the same connection
        await subscriber.connect()

        // subscribe to a channel
        await subscriber.subscribe("dummy-channel", (message, channel)=>{
            console.log(`Received message from ${channel}:${message}`)
        })
        

        //Publish a message to a channel
        await client.publish("dummy-channel", 'some dummy data from publisher');
        await client.publish("dummy-channel", 'some more dummy data from publisher');

        await new Promise((resolve)=> setTimeout(resolve, 3000));

        await subscriber.unsubscribe("dummy-channel")
        await subscriber.quit()

        // pipelining & transactions(Technique of sending multiple commands to the redis server in a batch)
        const multi = client.multi();

        multi.set("Key-transaction1", "value1")
        multi.set("Key-transaction2", "value2")
        multi.set("Key-transaction3", "value3")
        multi.get("Key-transaction1")
        multi.get("Key-transaction2")
        multi.get("Key-transaction3")

        const results = await multi.exec()
        console.log(results)

        // batch data operations
        const pipelineOne = client.multi()

        for(let i=0; i< 1000; i++){
            pipelineOne.set(`User:${i}:action`, `Action ${i}`)
        }

        const pipeResult =await pipelineOne.exec()
        console.log(pipeResult) 

    } catch (error) {
        console.error(error)
    }finally{
        await client.quit()
    }
}
testAdditionalFeatures()

export { testAdditionalFeatures}