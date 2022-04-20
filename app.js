const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const connect = require('./schemas');
const indexRouter = require('./routes');
const AWS = require('aws-sdk');
const authmiddleware = require('./middlewares/auth')
const port = 3000;
const app = express();

// 소켓 db schema 생성
var userSchema = mongoose.Schema({
    nickname: {type: String},
    message: {type: String}
})

// mongoose model compile
var Chat = mongoose.model('Chat', userSchema)

//소켓
const socketIo = require('socket.io')
const server = require('http').createServer(app)
// // 모든 도메인 허용 

const io = socketIo(server, {
    cors : {
        origin:"*", //여기에 명시된 서버만 호스트만 내서버로 연결을 허용할거야
        methods: ["GET","POST"],
    },
})


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

// auth 사용(token값 사용)
// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
// })

//소켓추가
io.on("connection", (socket)=> {
    console.log("연결이되었습니다.")
    socket.on("init", (payload) => {
        console.log("--------------"+JSON.stringify(payload), JSON.stringify(payload.name)+"--------------")
        Chat.find(function (err, result) {
            // console.log(socket.id)
            for(var i = result.length-1 ; i >= result.length-4; i--) {
                console.log(result[i])
                // var dbData = {nickname : result[i].nickname, message : result[i].message, createdAt : result[i].createdAt};
                // console.log(dbData.name, dbData.message)
                // io.emit("receive message", {nickname : result[i].nickname, message : result[i].message, createdAt : result[i].createdAt})
                io.emit("receive message", {nickname : JSON.stringify(payload.name), message : result[i].message, createdAt : result[i].createdAt})
            }
        });
    })
    socket.on("send message", (item) => {//send message 이벤트 발생
        console.log(item.name + " : " + item.message + " : " + item.createdAt);
        io.emit("receive message", { nickname: item.nickname, message: item.message, createdAt: item.createdAt, profileImg: item.profileImg});
        var chat = new Chat({ nickname: item.nickname, message: item.message, createdAt: item.createdAt, profileImg: item.profileImg });
        console.log(chat)
        console.log(item)
        chat.save(item)
       
     });
    
})


server.listen(port, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});

module.exports = app