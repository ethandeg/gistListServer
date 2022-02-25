const express = require("express");
const router = new express.Router();

router.post("/token", async (req, res, next) => {
    try {
        const { username, password } = req.body;
    } catch (e) {
        return next(e)
    }
})


module.exports = router;