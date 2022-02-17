"use strict";
const path = require("path");
const db = require("../db.js");
const List = require("../models/list");
const {readSqlFile, schemaSql} = require("../sql/callableDbSeed");

async function commonBeforeAll(){
    try {
        await db.query(`DROP TABLE IF EXISTS list_items`);
        await db.query(`DROP TABLE IF EXISTS lists`);
        await db.query(`DROP TABLE IF EXISTS users`);
        await db.query(schemaSql);
        const queries = readSqlFile(path.resolve(__dirname,"../sql/gistlist-seed.sql"));
        for(let query of queries){
            await db.query(query);
        }
    } catch(e){
        console.error(e)
    }



}
async function commonBeforeEach() {
    try {
        await db.query("BEGIN");
    } catch(e){
        console.error(e)
    }

  }
  
  async function commonAfterEach() {
      try{
            await db.query("ROLLBACK");
      } catch(e){
          console.error(e)
      }
    
  }
  
  async function commonAfterAll() {
      try{
        await db.end();
      } catch(e){
          console.error(e)
      }
    
  }

  async function getIds(){
      try {
        const lists = await db.query(`SELECT id FROM lists`);
        const listIds = lists.rows.map(item => item.id);
        const listItems = await db.query(`SELECT id FROM list_items`);
        const listItemIds = listItems.rows.map(item => item.id);
        return [listIds, listItemIds];
      } catch(e){
          console.error(e)
      }

  }

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    getIds
}