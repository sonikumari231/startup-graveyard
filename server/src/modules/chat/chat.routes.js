const express = require("express");
const { postChat} = require("./chat.controller");

const router = express.Router();
router.post("/",postChat);
module.exports = router;