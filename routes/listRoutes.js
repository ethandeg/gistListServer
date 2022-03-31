const express = require("express");
const router = new express.Router();
const List = require("../models/list");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const schemaCheck = require("../helpers/schemaCheck")
const createListSchema = require("../schemas/createListSchema.json")
const createListItemSchema = require("../schemas/createListItemSchema.json")
const patchListSchema = require("../schemas/patchListSchema.json")
const patchListItemSchema = require("../schemas/patchListItemSchema.json")
const deleteListSchema = require("../schemas/deleteListSchema.json")
const deleteListItemSchema = require("../schemas/deleteListItemSchema.json")

//GET ROUTES

router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const { limit } = req.query;
        const results = await List.getAllLists(limit);
        return res.json(results);
    } catch (e) {
        return next(e);
    }

});

//TO DO, ALSO INCLUDE LIST INFO LIKE NAME AND DESC
router.get("/:listId", ensureLoggedIn, async (req, res, next) => {
    try {
        const { listId } = req.params;
        const results = await List.getListInfo(listId);
        return res.json(results);
    } catch (e) {
        return next(e);
    }
});

//POST ROUTES

router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        schemaCheck(req.body, createListSchema);
        const listObj = req.body;
        const result = await List.create(listObj);
        result.success = true;
        return res.status(201).json(result);
    } catch (e) {
        return next(e);
    }
});

router.post("/item", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        schemaCheck(req.body, createListItemSchema);
        const itemObj = req.body;
        const result = await List.createListItem(itemObj);
        result.success = true;
        return res.status(201).json(result);
    } catch (e) {
        return next(e);
    }
})

//PATCH ROUTES

router.patch("/", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        schemaCheck(req.body, patchListSchema);
        const { id, ...listObj } = req.body;
        const result = await List.updateList(id, listObj);
        result.success = true;
        return res.json(result);
    } catch (e) {
        return next(e);
    }
})

router.patch("/item", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        schemaCheck(req.body, patchListItemSchema);
        const { id, ...itemObj } = req.body;
        const result = await List.updateListItem(id, itemObj);
        result.success = true;
        return res.json(result);
    } catch (e) {
        return next(e);
    }
});


//DELETE ROUTES 
router.delete("/", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        schemaCheck(req.body, deleteListSchema)
        const { id } = req.body;
        const result = await List.deleteList(id);
        result.success = true;
        return res.json(result);
    } catch (e) {
        return next(e);
    }
});


router.delete("/item", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        schemaCheck(req.body, deleteListItemSchema);
        const { id } = req.body;
        result = await List.deleteListItem(id);
        result.success = true;
        return res.json(result);
    } catch (e) {
        return next(e);
    }

});


module.exports = router;