const express = require("express");
const messageRouter = require("./message");
const userRouter = require("./user");


const router = express.Router();

// 앞에 /로 시작됨
router.use('/message', messageRouter);
router.use('/api', userRouter);


module.exports = router;
