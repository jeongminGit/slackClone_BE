const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
require('dotenv').config();

// .env
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, BUCKET_NAME } = process.env;
// console.log(S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, BUCKET_NAME)
const S3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_REGION,
});


const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (
        ext !== ".jpg" &&
        ext !== ".jpeg" &&
        ext !== ".png" &&
        ext !== ".gif" &&
        ext !== ".jfif"
    ) return cb({ message: "이미지 파일만 전송가능합니다." }, false);
    cb(null, true);
};

const storage = multerS3({
    s3: S3,
    bucket: BUCKET_NAME,
    key(req, file, cb) {
        cb(
            null,
            `profileImg/${Date.now()}${path.basename(file.originalname)}`
        );
    },
});

exports.upload = multer({
    storage: storage, limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter,
})