const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const schemaCheck = require("../helpers/schemaCheck");
const createUserSchema = require("../schemas/createUserSchema.json");
const updateUserSchema = require("../schemas/updateUserSchema.json");
//GET ROUTES
router.get("/", async (req, res, next) => {
    try {
        const { limit } = req.query;
        const result = await User.getAllUsers(limit);
        return res.json(result);
    } catch (e) {
        return next(e)
    }
})

router.get("/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params;
        const results = await User.getUser(userId);
        return res.json(results);
    } catch (e) {
        return next(e)
    }

});

//POST ROUTES

router.post("/", async (req, res, next) => {
    try {
        schemaCheck(req.body, createUserSchema);
        const results = await User.createUser(req.body);
        results.success = true;
        return res.status(201).json(results);
    } catch (e) {
        return next(e)
    }
})

//PATCH ROUTES

router.patch("/", async (req, res, next) => {
    try {
        schemaCheck(req.body, updateUserSchema);
        const { id, ...userObj } = req.body;
        const response = await User.updateUser(id, userObj);
        response.success = true;
        return res.json(response);
    } catch (e) {
        return next(e)
    }
})

//DELETE ROUTES

router.delete("/", async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await User.deleteUser(id);
        result.success = true;
        return res.json(result);
    } catch (e) {
        return next(e)
    }
})


module.exports = router;