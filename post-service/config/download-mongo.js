// download-mongo.js
import { MongoMemoryServer } from "mongodb-memory-server-core";

const downloadMongoBinary = async () => {
  const instance = await MongoMemoryServer.create();
  console.log("MongoDB binary downloaded at:", instance.getUri());
  await instance.stop();
};

downloadMongoBinary();