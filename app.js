const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const connect = require('./schemas');
const Chat = require('./schemas/chat')
const indexRouter = require('./routes');
const AWS = require('aws-sdk');
const authmiddleware = require('./middlewares/auth')
const port = 3000;
const app = express();

// // 소켓 db schema 생성
// var ChatSchema = mongoose.Schema({
//     nickname: {type: String},
//     message: {type: String}
// })

// // mongoose model compile
// var Chat = mongoose.model('Chat', ChatSchema)

//소켓
const socketIo = require('socket.io');
const { create } = require('./schemas/user');
const { Iot, Route53Domains } = require('aws-sdk');
const { SocketAddress } = require('net');
const server = require('http').createServer(app)
// // 모든 도메인 허용 

const io = socketIo(server, {
    cors: {
        origin: "*", //여기에 명시된 서버만 호스트만 내서버로 연결을 허용할거야
        methods: ["GET", "POST"],
    },
})

// var socket = io.connect('http://server.com', { reconnection: true });

app.use(cors());
connect();

const router = express.Router();
app.use(bodyParser.json());
app.use(express.json());
app.use('/', express.urlencoded({ extended: false }), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser

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
// const room = io.of('/chat')
// room.on("connetion", (socket) => {
//     socket.on("join", (myInfo, callback) => {
//         console.log("+++++++++++++++++++++++++++++++++++++++++",nickname, room,"+++++++++++++++++++++++++++++++++++++++++")
//         console.log(socket.id, "socketid")
//         console.log(socket.rooms)
//         socket.join(room);
//         socket.emit("receive message", {
//             user: nickname,
//             test: nickname + "welcome to the room" + room
//         })
//     })
// })
// , { reconnection: true }
const chat = io.of('/chat')
chat.on("connection", (socket) => {
    console.log("connection 연결이되었습니다.")
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",socket.rooms)
    // console.log(socket.id)
    socket.on("init", (payload) => {
        console.log("init 연결되었습니다~~~")
        Chat.find(function (err, result) {
            const arr = []
            if (result.length !== 0) {
                for (var i = result.length - 1; i >= 0; i--) {
                    arr.push({ nickname: result[i].nickname, message: result[i].message, createdAt: result[i].createdAt, profileImg: result[i].profileImg })
                }
                chat.to(socket.id).emit("receive message", arr.reverse())
            }
        })
        // exixtRoom = Chat.find({ roomName: room })
    });
    // socket.on("join", ({ roomName: room, nickname: nickname }) => {
    //     console.log("join 연결이되었습니다.")
    //     // console.log("+++++++++++++++++++++++++++++++++", socket.rooms, "+++++++++++++++++++++++++++++++++")
    //     // console.log(socket.id)
    //     socket.join(room, nickname)
    //     // Chat.find(function (err, result) {
    //     //     const arr = []
    //     //     if (result.length !== 0) {
    //     //         for (var i = result.length - 1; i >= 0; i--) {
    //     //             arr.push({ nickname: result[i].nickname, message: result[i].message, createdAt: result[i].createdAt, profileImg: result[i].profileImg })
    //     //         }
    //     //         chat.to(socket.id).emit("receive message", arr.reverse())
    //     //     }
    //     // })
    //     // socket.emit("join", nickname, "님이 입장했습니다.");
    //     // const { headers: { referer } } = req;
    //     // const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
    //     // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+req, referer, roomId)
    //     // socket.join(roomId);
    //     // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+socket.request)
    // })
    socket.on("send message", (item) => {//send message 이벤트 발생
        // item: {nickname: String, msg: String, createdAt: String, profileImg: String}
        // console.log("+++++++++++++++++++++++++++++++++", room, "+++++++++++++++++++++++++++++++++")
        chat.emit("receive message", { nickname: item.nickname, message: item.message, createdAt: item.createdAt, profileImg: item.profileImg });
        console.log("item입니다----------------------!!!!!!!!!!", item)
        const saveChat = new Chat({
            nickname: item.nickname,
            message: item.message,
            createdAt: item.createdAt,
            profileImg: item.profileImg,
            // roomName: room
        })
        saveChat.save()
        // socket.leave(room);;
        // console.log("사용자 추방!!!!!!!!!!!!!")
        // const req = socket.request;
        // const { headers: { referer } } = req;
        // const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
        // console.log("#####################################################"+req, referer, roomId)
    });
    // socket.on("disconnect", () => {
    //     socket.leave();
    //     console.log("++++++++++++++++++++++++++++++++++++++++++++방을 나간거야!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //     // chat.to(room).emit("onDisconnect", `${nickname} 님이 퇴장하셨습니다.`)
    // });
});


server.listen(port, () => {
    console.log(new Date().toLocaleString(), port, ': connect');
});

module.exports = app