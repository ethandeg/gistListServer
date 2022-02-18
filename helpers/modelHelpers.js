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

function getProperJsValues(arrOfObj){
        const jsProper = [];
        arrOfObj.map(obj => {
            let newObj = {};
            for([k,v] of Object.entries(obj)){
                let key = snakeToCamel(k);
                newObj[key] = v
            }
        jsProper.push(newObj)
        })
        return jsProper
}
// const test = [
//     {
//       id: 1,
//       name: 'my shopping list',
//       description: 'list for shopping',
//       created: "2022-02-17T23:18:59.312Z",
//       user_id: 1
//     },
//     {
//       id: 2,
//       name: 'chritmas list',
//       description: 'what i want this year for christmas',
//       created: "2022-02-17T23:18:59.312Z",
//       user_id: 1
//     },
//     {
//       id: 3,
//       name: 'dolly stuff',
//       description: 'stuff for dolly',
//       created: "2022-02-17T23:18:59.312Z",
//       user_id: 2
//     }
//   ]
// let x = getProperJsValues(test)

// console.log(x)
module.exports = { sqlForPartialUpdate, snakeToCamel, camelToSnake, getProperJsValues }