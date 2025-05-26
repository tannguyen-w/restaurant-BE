const express = require("express");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  res.send("API Server");
});

module.exports = routerAPI;
