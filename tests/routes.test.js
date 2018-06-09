const app = require("../src/app");
const request = require("supertest");

test("test hello world route", async () => {
  const { statusCode} = await request(app).get("/");
  expect(statusCode).toBe(200);
})