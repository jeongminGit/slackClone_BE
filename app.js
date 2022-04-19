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


//MongoDB 설정

// var db = mongoose
// .connect("mongodb+srv://SlackClone:slack2022@cluster0.ij7rk.mongodb.net/SlackClone?retryWrites=true&w=majority",{
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
//         ignoreUndefined: true
//     })
//     .then(() => console.log('MongoDB 연결완료'))
//     .catch(err =>{console.log(err);
// });


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

// const corsOptions = {
//     origin: '*',
//     // credentials: true
// };

// app.use(cors(corsOptions));


app.listen(port, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});