const express = require("express");
const router = new express.Router();
const List = require("../models/listModel");


//GET ROUTES
router.get("/", async(req,res,next) => {
    try {
        const {limit} = req.query;
        const results = await List.getAllLists(limit);
        return res.json(results);
    } catch(e){
        return next(e);
    }

});

//TO DO, ALSO INCLUDE LIST INFO LIKE NAME AND DESC
router.get("/:listId", async(req,res,next) =>{
    try {
        const {listId} = req.params;
        const results = await List.getListItems(listId);
        return res.json(results);
    } catch(e){
        return next(e);
    }
});

//POST ROUTES

router.post("/", async (req, res, next) => {
    try {
        const listObj = req.body;
        const result = await List.create(listObj);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }
});

router.post("/item", async(req,res,next) => {
    try {
        const itemObj = req.body;
        const result = await List.createListItem(itemObj);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }
})

//PATCH ROUTES

router.patch("/", async(req,res,next) => {
    try {
        const {id, ...listObj} = req.body;
        const result = await List.updateList(id, listObj);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }
})

router.patch("/item", async(req,res,next) => {
    try {
        const {id, ...itemObj} = req.body;
        const result = await List.updateListItem(id, itemObj);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }
});


//DELETE ROUTES 
router.delete("/", async (req,res,next) => {
    try {
        const {id} = req.body;
        const result = await List.deleteList(id);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }
});


router.delete("/item", async (req, res ,next) => {
    try{
        const {id} = req.body;
        result = await List.deleteListItem(id);
        result.success = true;
        return res.json(result);
    } catch(e){
        return next(e);
    }

});


module.exports = router;