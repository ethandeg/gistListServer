const { BadRequestError } = require("../expressError")



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

function prepareInsert(insertObj){
    //key return needs to look like this
    //(col1, col2, col3)
    //values needs to be
    //($1, $2, $3)
    let keys = Object.keys(insertObj);
    let values = [];
    keys = keys.map(key => camelToSnake(key));
    keys = keys.join(", ");
    keys = `(${keys})`;
    const valuesLength = Object.values(insertObj).length;
    for(let i = 0; i < valuesLength; i++){
        values.push(`$${i + 1}`);
    }
    values = values.join(", ");
    values = `(${values})`;
    return {
        keys,
        values,
    }
}



module.exports = { sqlForPartialUpdate, snakeToCamel, camelToSnake, getProperJsValues, prepareInsert }