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

        // learning Redis in details
        // String => SET, GET, MSET, MGET
        const multipleValues = await client.mSet([
            "username:name", "Emmanuel",
            "user:email", "emmanuelgetange48@gmail.com",
            "user:age", "60",
            "user:country", "Kenya"
        ])
        const [name, email, age, country ] = await client.mGet(["username:name","user:email", "user:age","user:country"])
        console.log(name, email, age, country)

        // Lists => LPUSH,RPUSH, LRANGE, LPOP, RPOP
        // await client.lPush("notes", 'note 1', 'note 2', 'note 3')
        // const extractAllNotes = await client.lRange('notes', 0, -1)
        // console.log(extractAllNotes)  
        
        // const firstNote = await client.lPop("notes")
        // console.log(firstNote)

        // const remainingNotes = await client.lRange("notes", 0 , -1)
        // console.log(remainingNotes)



        //Sets -> SADD, SMEMBERS, SISMEMBER, SREM
        // await client.sAdd("user:nickName", ['John', 'Njue', 'Kimenju'])
        // const extractAllNicknames = await client.sMembers("user:nickName")
        // console.log(extractAllNicknames)
        // const isNjueOneOfMembers = await client.sIsMember("user:nickName", "Njue")
        // console.log(isNjueOneOfMembers)

        // await client.sRem("user:nickName", "Kimenju")

        // const getUpdatedUsernames = await client.sMembers("user:nickName")
        // console.log(getUpdatedUsernames)

        // await client.del("user:nickName")



        // Sorted sets
        // ZZADD, ZRANGE, ZRANK, ZREM

        // await client.zAdd('cart', [
        //     {
        //         score: 100, value: 'cart 1'
        //     },
        //     {
        //         score: 150, value: 'cart 2'
        //     },
        //     {
        //         score: 200, value: 'cart 3'
        //     },
        //     {
        //         score: 50, value: 'cart 4'
        //     }
        // ])

        // const getTopCartItems = await client.zRange("cart", 0, -1)
        // console.log(getTopCartItems)

        // const extractAllCartItemsWithScores = await client.zRangeWithScores("cart", 0, -1)
        // console.log(extractAllCartItemsWithScores)

        // const cartTwoRank = await client.zRank("cart", "cart 4")
        // console.log(cartTwoRank)


        // Hashes => HSET, HGET, HGETALL, HDEL
        await client.hSet("person:1", {
            name: "Getange",
            description: "Junior backend developer",
            rating: '5'
        })

        const getUserRating = await client.hGet('person:1', 'rating')
        console.log(getUserRating)

        const getFullProperty = await client.hGetAll('person:1')
        console.log(getFullProperty)

        const deleteProperty = await client.hDel('person:1', 'rating')
        console.log(deleteProperty)

        const getUpdatedProperty = await client.hGetAll('person:1')
        console.log(getUpdatedProperty)
        
    } catch (error) {
        console.error(error)
    }finally{
        await client.quit()
    }
}
testRedisConnection()

export { testRedisConnection }