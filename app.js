const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

const listRoutes = require("./routes/listRoutes");
app.use(express.json());
app.use(cors());
app.use("/list", listRoutes);


app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });


module.exports = app;