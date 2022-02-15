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


router.get("/:listId", async(req,res,next) =>{
    try {
        const {listId} = req.params;
        const results = await List.getListItems(listId);
        return res.json(results);
    } catch(e){
        return next(e);
    }
})



module.exports = router;