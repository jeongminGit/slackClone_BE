const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const connect = require('./schemas');
const indexRouter = require('./routes');
const AWS = require('aws-sdk');
const port = 3000;

connect();

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(express.json());
app.use('/', express.urlencoded({extended: false}), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser

// post middleware
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date()); //request 로그 남기는 미들웨어
    
    var s3 = new AWS.S3();
    var params = {Bucket: 'slackclone-be', Key: 'basic_profileImg.png'};
    var file = require('fs').createWriteStream('./profileImg/basic_profileImg.png');

    s3.getObject(params).on('httpData', function(chunk) { file.write(chunk); }).on('httpDone', function() { file.end(); }).
    send();
    next();
};

app.use(requestMiddleware);
app.use('/', indexRouter);

const corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});
