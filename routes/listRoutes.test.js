"use strict"
const request = require("supertest");
const { set } = require("../app");

const app = require("../app");

describe("GET route to list all of the lists", () => {
    test("Displays only one list if limit is set to one", async() => {
        //need to have a create function to have my common before all populate this db
    })
})