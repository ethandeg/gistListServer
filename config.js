const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
const SECRET_KEY = process.env.SECRET_KEY || "codyIs!th$cuteSTdoGGY!";

module.exports = {
    BCRYPT_WORK_FACTOR,
    SECRET_KEY
}