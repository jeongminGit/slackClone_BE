require("dotenv").config();
const express = require("express");
const connect = require("./schemas/index.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const routers = require("./routes");
const app = express();
const port = 3000;

//소켓
const Http = require("http")
const socketIo = require("socket.io");

const http = Http.createServer(app);

const io = socketIo(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});


connect();


// 미들웨어 (가장 상위에 위치)
const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
}

app.use(cors());
app.use(express.static("static"))
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//다이렉트 메시지
io.on("connection", (socket) => {
    console.log("연결됨!", new Date())

    //프론트 확인메시지
    socket.send("다이렉트메시지 소켓작동!")


    //메시지 방 만들기
    socket.join("userId~~");
    console.log(socket.rooms, "방 만들기 완성!")


    //메시지 방 지우기
    socket.leave("room 237");
    io.to("room 237").emit(`user ${socket.id} has left the room`);

    //연결끊겼을 때,
    socket.on("disconnect", () => {            
        console.log("누군가 연결을 끊었어요~")
    });
});

app.use(requestMiddleware);

app.use('/', routers);

//도메인
http.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌어요!')
}); 
