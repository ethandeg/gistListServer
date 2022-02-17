"use strict";
const path = require("path");
const db = require("../db.js");
const Lesson = require("../models/list");
const {readSqlFile, schemaSql} = require("../sql/callableDbSeed");
let listIds = [];
let listItemIds = [];

async function commonBeforeAll(){
    await db.query(`DROP TABLE IF EXISTS list_items`);
    await db.query(`DROP TABLE IF EXISTS lists`);
    await db.query(`DROP TABLE IF EXISTS users`);
    await db.query(schemaSql);
    const queries = readSqlFile(path.resolve(__dirname,"../sql/gistlist-seed.sql"));
    for(let query of queries){
        await db.query(query);
    }
    const lists = await db.query(`SELECT id FROM lists`);
    const listItems = await db.query(`SELECT id FROM list_items`);
    listIds = [...listIds, ...lists.rows.map(l => l.id)];
    listItemIds = [...listItemIds, ...listItems.rows.map(li => li.id)];

}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    listIds,
    listItemIds
}