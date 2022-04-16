require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require("cors"); 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');

const ColorHash = require('color-hash');

const webSocket = require('./socket');
const indexRouter = require('./routes');
const connect = require('./schemas');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
connect();

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', indexRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server, app, sessionMiddleware);




//////////////////////////////////////////////

// require("dotenv").config(); ///
// const express = require("express"); ///
// const connect = require("./schemas/");//
// const cors = require("cors"); //
// const bodyParser = require("body-parser");
// const routers = require("./routes");
// const ColorHash = require('color-hash');

// const app = express();
// const port = 3000;

// //소켓
// const Http = require("http")
// const socketIo = require("socket.io");

// const http = Http.createServer(app);

// const io = socketIo(http, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     },
// });


// connect();


// // 미들웨어 (가장 상위에 위치)
// const requestMiddleware = (req, res, next) => {
//     console.log('Request URL:', req.originalUrl, ' - ', new Date());
//     next();
// }

// app.use(cors());
// app.use(express.static("static"))
// app.use(express.urlencoded({extended: false}))
// app.use(express.json());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

// //다이렉트 메시지
// io.on("connection", (socket) => {
//     console.log("연결됨!", new Date())

//     //프론트 확인메시지
//     socket.send("다이렉트메시지 소켓작동!")


//     //메시지 방 만들기
//     socket.join("userId~~");
//     console.log(socket.rooms, "방 만들기 완성!")


//     //메시지 방 지우기
//     socket.leave("room 237");
//     io.to("room 237").emit(`user ${socket.id} has left the room`);

//     //연결끊겼을 때,
//     socket.on("disconnect", () => {            
//         console.log("누군가 연결을 끊었어요~")
//     });
// });

// app.use(requestMiddleware);

// app.use('/', routers);

// //도메인
// http.listen(port, () => {
//   console.log(port, '포트로 서버가 켜졌어요!')
// }); 
