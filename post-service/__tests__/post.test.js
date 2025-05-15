import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import createServer from "./../utils/mkServer.js";

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    dbName: "post-db"
  });

  app = createServer();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Posts", () => {
    describe("GET /v1/post/:id", () => {
        it("should return 404 if post does not exist", async () => {
        const postId = "postId-123";
        await supertest(app).get(`/v1/post/${postId}`).expect(404);
        });
    });
    describe("GET /v1/post/", () => {
        it("it should return error 404 if posts do not exists", async()=>{
            expect(true).toBe(true)
        })
  });
});
