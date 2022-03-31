const db = require("../db");
const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, getProperJsValues } = require("../helpers/modelHelpers");
class List {
    static async doesListExist(listId) {
        const results = await db.query(`SELECT id FROM lists WHERE id = $1`, [listId]);
        return !!results.rows.length;
    }
    static async doesListItemExist(itemId) {
        const results = await db.query(`SELECT id FROM lists WHERE id = $1`, [itemId]);
        return !!results.rows.length;
    }
    static async getAllLists(limit = 100) {
        const results = await db.query(`SELECT * FROM lists ORDER BY id ASC LIMIT $1`, [limit]);
        return getProperJsValues(results.rows);
    }

    static async getListInfo(listId) {
        if (!Number(listId)) throw new BadRequestError("ID in parameter needs to be an integer");
        const doesListExist = await this.doesListExist(listId);
        if (doesListExist) {
            let lists = await db.query(`SELECT * FROM lists WHERE id = $1`, [listId]);
            lists = getProperJsValues(lists.rows)[0];
            let items = await db.query(`SELECT * FROM list_items WHERE list_id = $1`, [listId])
            items = getProperJsValues(items.rows);
            lists.items = items;
            return lists;
        }
        throw new BadRequestError(`No list with id: ${listId}`);
    }

    static async create(listObj) {
        //name, description, user_id;
        const { name, description, userId } = listObj;
        const result = await db.query(`INSERT INTO lists (name, description, user_id) 
                                       VALUES($1,$2,$3) 
                                       RETURNING id`, [name, description, userId]);
        if (!result.rows.length) {
            throw new BadRequestError(`Something wrong with the request, make sure you have a name: str, description:str, userId: int`);
        }
        return result.rows[0];
    }

    static async createListItem(itemObj) {
        //item, item_link, list_id
        const { item, itemLink, listId } = itemObj;
        const doesListExist = await this.doesListExist(listId);
        if (!doesListExist) throw new BadRequestError("List ID does not exist");
        const result = await db.query(`INSERT INTO list_items(item, item_link, list_Id) 
                                       VALUES ($1, $2, $3)
                                       RETURNING id`, [item, itemLink, listId]);
        if (!result.rows.length) {
            throw new BadRequestError(`Something went wrong with the request`);
        }
        return result.rows[0];
    }

    static async updateList(id, listObj) {
        const doesListExist = await this.doesListExist(id);
        if (!doesListExist) throw new BadRequestError("No list with that id");
        const { setCols, values } = sqlForPartialUpdate(listObj);
        const varIdx = `$${values.length + 1}`;
        const querySql = `UPDATE lists SET ${setCols}
                          WHERE id = ${varIdx} 
                          RETURNING id`;
        const result = await db.query(querySql, [...values, id]);
        if (!result.rows.length) {
            throw BadRequestError("There was an issue updating value with id " + id);
        }
        return result.rows[0];
    }

    static async updateListItem(id, listItemObj) {
        const doesListItemExist = await this.doesListItemExist(id);
        if (doesListItemExist) {
            const { setCols, values } = sqlForPartialUpdate(listItemObj);
            const varIdx = `$${values.length + 1}`;
            const querySql = `UPDATE list_items SET ${setCols} 
                              WHERE id = ${varIdx}
                              RETURNING id`;
            const result = await db.query(querySql, [...values, id]);
            if (!result.rows.length) {
                throw new BadRequestError("There was an issue updating value with id " + id);
            }
            return result.rows[0];
        }
        throw new BadRequestError("ListItem does not exist");
    }

    static async deleteList(id) {
        const result = await db.query(`DELETE FROM lists WHERE id = $1 RETURNING id`, [id]);
        if (!result.rows.length) {
            throw new BadRequestError;
        }
        return result.rows[0];
    }

    static async deleteListItem(id) {
        const result = await db.query(`DELETE FROM list_items WHERE id = $1 RETURNING id`, [id]);
        if (!result.rows.length) {
            throw new BadRequestError;
        }
        return result.rows[0];
    }
}


module.exports = List;