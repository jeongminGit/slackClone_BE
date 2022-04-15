const express = require("express");
const messageRouter = require("./message");


const router = express.Router();

// 앞에 /로 시작됨
router.use('/', messageRouter);


module.exports = router;

