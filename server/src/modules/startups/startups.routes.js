const express = require('express');
const { getStartups } = require('./startups.controller');
const { createStartup } = require('./startups.controller');
const { validateStartup } = require("./startup.validation");

const router = express.Router();

router.get("/", getStartups);
router.post("/", validateStartup, createStartup);

module.exports = router;