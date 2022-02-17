"use strict"
const request = require("supertest");
const { set } = require("../app");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    getIds
  } = require("./_testCommon");
let listIds;
let listItemIds;
  beforeAll(async() => {
      await commonBeforeAll();
      let [x, y] = await getIds()
      listIds = x;
      listItemIds = y;
  })
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);



describe("GET route to list all of the lists", () => {
    test("Displays only one list if limit is set to one", async() => {
        try {
            const resp = await request(app)
            .get(`/list?limit=1`)
            expect(resp.statusCode).toEqual(200)
            expect(resp.body.length).toBe(1);
            expect(resp.body[0].id).toBeDefined();
            expect(resp.body[0].id).toEqual(listIds[0]);
        } catch(e){
            console.error(e)
        }

    });

    test("Shows more than 1 if limit is set higher", async() => {
        try {
            const resp = await request(app)
            .get(`/list?limit=2`)
            expect(resp.statusCode).toEqual(200);
            expect(resp.body.length).toBe(2);
            expect(resp.body[0].id).toBeDefined();
            expect(resp.body[1].id).toBeDefined();
        } catch(e) {
            console.error(e)
        }
 
    })
});

