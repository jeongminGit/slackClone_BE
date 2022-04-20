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
        io.emit("receive message", { nickname: item.name, message: item.message, createdAt: item.createdAt});
        var chat = new Chat({ nickname: item.name, message: item.message, createdAt: item.createdAt });
        console.log(chat)
        console.log(item)
        chat.save(item)
       
       //클라이언트에 이벤트를 보냄
     });
    // sends message to other users + stores data(username + message) into DB
    // socket.on('message', function(data) {
 
    //     io.emit('message', data);
    //     // add chat into the model
    //     var chat = new Chat({ name: data.name, message: data.message });
 
    //     chat.save(function (err, data) {
    //       if (err) {// TODO handle the error
    //           console.log("error");
    //       }
    //       console.log('message is inserted');
    //     });
 
    // });

    
})


server.listen(port, () => {
    console.log( new Date().toLocaleString() , port, ': connect');
});

module.exports = app