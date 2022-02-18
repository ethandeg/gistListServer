const db = require("../db");
const {BadRequestError} = require("../expressError");
const {sqlForPartialUpdate, getProperJsValues, prepareInsert} = require("../helpers/modelHelpers");

class User {
    static async getAllUsers(limit = 100){
        const results = await db.query(`SELECT * FROM users LIMIT $1`, [limit])
        return getProperJsValues(results.rows);
    }

    static async getUser(identifier){
        if(!Number(identifier)) throw new BadRequestError("Please search by an id number");
        const userRes = await db.query(`SELECT * FROM users WHERE id = $1`, [identifier]);
        if(!userRes.rows.length) throw new BadRequestError("Cannot find user with this id");
        const listRes = await db.query(`SELECT * FROM lists WHERE user_id = $1`, [identifier]);
        const user = getProperJsValues(userRes.rows);
        user[0].lists = getProperJsValues(listRes.rows);
        return user[0];
    }

    static async createUser(userObj){
        const {keys, values} = prepareInsert(userObj);
        const results = await db.query(`INSERT INTO users ${keys} VALUES ${values} RETURNING id`, Object.values(userObj));
        if(!results.rows.length){
            throw new Error("Something went wrong on our end");
        }
        return results.rows[0];
    }
}


module.exports = User;