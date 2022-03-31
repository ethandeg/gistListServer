const db = require("../db");
const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, getProperJsValues, prepareInsert } = require("../helpers/modelHelpers");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
class User {
    static async getAllUsers(limit = 100) {
        const results = await db.query(`SELECT * FROM users LIMIT $1`, [limit])
        return getProperJsValues(results.rows);
    }

    static async getUser(identifier) {
        if (!Number(identifier)) throw new BadRequestError("Please search by an id number");
        const userRes = await db.query(`SELECT * FROM users WHERE id = $1`, [identifier]);
        if (!userRes.rows.length) throw new BadRequestError("Cannot find user with this id");
        const listRes = await db.query(`SELECT * FROM lists WHERE user_id = $1`, [identifier]);
        const user = getProperJsValues(userRes.rows);
        user[0].lists = getProperJsValues(listRes.rows);
        return user[0];
    }

    static async validateUserPass(id, password) {
        const result = await db.query(`SELECT * FROM users WHERE id = $1 AND password = $2`, [id, password]);
        return !!result.rows.length;
    }

    static async createUser(userObj) {
        const duplicateCheck = await db.query(`SELECT id FROM users WHERE username = $1`, [userObj.username]);
        if (duplicateCheck.rows.length) throw new BadRequestError(`Duplicate username: ${userObj.username}`);
        const hashedPassword = await bcrypt.hash(userObj.password, BCRYPT_WORK_FACTOR);
        userObj.password = hashedPassword;
        const { keys, values } = prepareInsert(userObj);
        const results = await db.query(`INSERT INTO users ${keys} VALUES ${values} RETURNING id`, Object.values(userObj));
        if (!results.rows.length) {
            throw new Error("Something went wrong on our end");
        }
        return results.rows[0];
    }

    static async updateUser(id, userObj) {
        const { oldPassword, ...infoToUpdate } = userObj;
        const isValid = await this.validateUserPass(id, oldPassword);
        if (!isValid) throw new BadRequestError("Invalid password");
        const { setCols, values } = sqlForPartialUpdate(infoToUpdate);
        const varIdx = `$${values.length + 1}`;
        const results = await db.query(`UPDATE users SET ${setCols} WHERE id = ${varIdx} RETURNING id`, [...values, id]);
        if (!results.rows.length) throw new Error("There was an issue updating user id: " + id);
        return results.rows[0];

    }

    static async deleteUser(id) {
        const results = await db.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
        if (!results.rows.length) throw new BadRequestError("No user with the id of " + id);
        return results.rows[0]
    }

    static async authenticate(username, password) {
        const result = await db.query(`SELECT username, password, id FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];
        if (!user) {
            throw new BadRequestError("No user by the username of " + username);
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            delete user.password;
            return user;
        }
        throw new BadRequestError("Password is incorrect");
    }

}


module.exports = User;