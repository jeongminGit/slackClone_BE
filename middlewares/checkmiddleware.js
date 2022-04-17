const express = require("express");
const path = require("path");
const User = require("../schemas/user")
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const router = require("../routes/user");
const { upload } = require("../middlewares/upload")
require('dotenv').config();

router.post("/check", upload.single('image'), async (req, res) => {
  const profileImg = req.file.location;
  const checkImg = await User.create({profileImg})
  res.json({result : checkImg})
}),


module.exports = router;