const express = require("express");
const routes = express.Router();
const { createHelp } = require("../controllers/HelpController");

routes.post("/", createHelp);

module.exports = routes;