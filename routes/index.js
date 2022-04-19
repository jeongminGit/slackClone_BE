const express = require("express");
const userRouter = require("./user");
const channelRouter = require("./channel");


const router = express.Router();

router.use('/user', userRouter);
router.use('/', channelRouter);

module.exports = router;