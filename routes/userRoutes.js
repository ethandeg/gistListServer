const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const schemaCheck = require("../helpers/schemaCheck");
const createUserSchema = require("../schemas/createUserSchema.json");

//GET ROUTES
router.get("/", async(req, res, next) => {
    try{
        const {limit} = req.query;
        const result = await User.getAllUsers(limit);
        return res.json(result);
    } catch(e){
        return next(e)
    }
})

router.get("/:userId", async(req, res, next) => {
    try {
        const {userId} = req.params;
        const results = await User.getUser(userId);
        return res.json(results);
    } catch(e){
        return next(e)
    }

});

//POST ROUTES

router.post("/", async(req, res, next) => {
    try {
        schemaCheck(req.body, createUserSchema);
        const results = await User.createUser(req.body);
        results.success = true;
        return res.status(201).json(results);
    } catch(e){
        return next(e)
    }
})

//PATCH ROUTES


module.exports = router;