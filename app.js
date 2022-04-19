const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const connect = require('./schemas');
const indexRouter = require('./routes');
const AWS = require('aws-sdk');
const port = 3000;
const app = express();


app.use(cors());
connect();

const router = express.Router();
app.use(bodyParser.json());
app.use(express.json());
app.use('/', express.urlencoded({extended: false}), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser

// post middleware
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date()); //request 로그 남기는 미들웨어
    next();
};

app.use(requestMiddleware);
app.use('/', indexRouter);


app.listen(port, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});