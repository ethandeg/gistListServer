const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const schemaCheck = require("../helpers/schemaCheck");
const { createToken } = require("../helpers/token");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const loginUserSchema = require("../schemas/loginUser.json");
const createUserSchema = require("../schemas/createUserSchema.json");
const updateUserSchema = require("../schemas/updateUserSchema.json");
//GET ROUTES
router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const { limit } = req.query;
        const result = await User.getAllUsers(limit);
        return res.json(result);
    } catch (e) {
        return next(e)
    }
})

router.get("/:userId", ensureCorrectUserOrAdmin, async (req, res, next) => {
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
        const token = createToken(results);
        results._token = token;
        return res.status(201).json(results);
    } catch (e) {
        return next(e)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        schemaCheck(req.body, loginUserSchema);
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        user._token = token;
        return res.json(user);
    } catch (e) {
        return next(e)
    }
})

//PATCH ROUTES

router.patch("/", ensureCorrectUserOrAdmin, async (req, res, next) => {
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

router.delete("/", ensureCorrectUserOrAdmin, async (req, res, next) => {
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