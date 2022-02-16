const request = require("supertest");

const app = require("./app");
const db = require("./db");

describe("404 tests", function() {
    test("not found for site 404", async function () {
        const resp = await request(app).get("/no-such-path");
        expect(resp.statusCode).toEqual(404);
      });
})

afterAll(function () {
    db.end();
  });