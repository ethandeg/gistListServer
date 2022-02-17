const fs = require("fs");
const path = require('path')


const schemaSql = fs.readFileSync(path.resolve(__dirname, "./gistlist-schema.sql")).toString();

// const seedSql = fs.readFileSync("./sql/gistlist-seed.sql").toString();
// const seedSql = fs.readFileSync("./gistlist-seed.sql").toString();
// console.log(seedSql.split(";"))
const readSqlFile = (file) =>{
    return fs.readFileSync(file).toString()
    .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function(el) {return el.length != 0});
}



module.exports = {
    schemaSql,
    readSqlFile
}