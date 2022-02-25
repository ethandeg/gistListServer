const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

const createToken = (user) => {
    const payload = {
        username: user.username,
        // admin: user.admin
    }
    return jwt.sign(payload, SECRET_KEY)
}

module.exports = { createToken }