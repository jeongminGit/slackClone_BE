const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user');
const checkmiddleware = require('./middlewares/checkmiddleware')
const AWS = require('aws-sdk');
const port = 3000;


//MongoDB 설정
//mongoose.connect('mongodb://localhost/mydb', {});
var db = mongoose
.connect("mongodb+srv://test:test@cluster0.9zxeb.mongodb.net/cluster0?retryWrites=true&w=majority",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
        ignoreUndefined: true
    })
    .then(() => console.log('MongoDB 연결완료'))
    .catch(err =>{console.log(err);
});

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
app.use('/user', userRouter);
// app.use('/user/check', checkmiddleware)

const corsOptions = {
    origin: '*',
    // credentials: true
};

// app.get('/', async (req, res) => {
//     console.log("main_page")   
//     bodyParser.json()
//     res.sendFile(__dirname + "/test.html");
// });

// app.use(cors());
app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});