const { BadRequestError } = require("../expressError")

// function sqlForPartialUpdate(dataToUpdate, jsToSql) {
//     const keys = Object.keys(dataToUpdate);
//     if (keys.length === 0) throw new BadRequestError("No data");

//     // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
//     const cols = keys.map((colName, idx) =>
//         `"${jsToSql[colName] || colName}"=$${idx + 1}`,
//     );

//     return {
//         setCols: cols.join(", "),
//         values: Object.values(dataToUpdate),
//     };
// }

function sqlForPartialUpdate(dataToUpdate) {
    //data to update would look something like this
    //{firstName: "Ethan", lastName:"Degenhardt", id: 3, profilePic: "new profile picture"}
    //needs to return something like this
    //=> columns first_name
    const keys = Object.keys(dataToUpdate);
    if (!keys.length) throw new BadRequestError("no data")
    const cols = keys.map((colName, i) => `"${camelToSnake(colName)}" =$${i + 1}`)
    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate)
    }
}



function snakeToCamel(str) {
    const index = str.indexOf("_")
    if (index === -1 || !str[index + 1]) return str
    const upper = str[index + 1].toUpperCase()
    const arr = str.split("")
    arr[index + 1] = upper
    arr.splice(index, 1)
    return snakeToCamel(arr.join(""))
}

function camelToSnake(str) {
    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const arr = str.split("")
    for (let i = 0; i < arr.length; i++) {
        if (uppers.includes(arr[i])) {
            const lowerVal = arr[i].toLowerCase()
            arr[i] = lowerVal
            arr.splice(i, 0, "_")
        }
    }
    return arr.join("")
}


module.exports = { sqlForPartialUpdate }