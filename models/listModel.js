const db = require("../db");
const {BadRequestError} = require("../expressError");

class List {
    static async doesListExist(listId){
        const results = await db.query(`SELECT id FROM lists WHERE id = $1`, [listId]);
        return !!results.rows.length;
    }
    static async getAllLists(limit = 100){
        const results = await db.query(`SELECT * FROM lists ORDER BY id DESC LIMIT $1`, [limit]);
        return results.rows;
    }

    static async getListItems(listId){
        const doesListExist = await this.doesListExist(listId);
        if(doesListExist){
            const results = await db.query(`SELECT * FROM list_items WHERE id = $1`, [listId]);
            return results.rows;
        } 
        throw new BadRequestError(`No list with id: ${listId}`);
    }
}


module.exports = List;