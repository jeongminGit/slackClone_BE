require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require("cors"); 
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const connect = require('./schemas');

//소켓
const http = require("http")
const socketIo = require("socket.io")

const app = express();
const server = http.createServer(app)
const io = socketIo(server);

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});


connect();

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
}


app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);


app.use('/', indexRouter);


server.listen(app.get('port'), () => {
    console.log(app.get('port'),  '번 서버가 켜졌어요!');
});

io.on("connection", (socket)=> {
  console.log("연결이되었습니다.")
  socket.on("init", (payload) => {
      console.log(payload)
  })
  socket.on("send message", (item) => {//send message 이벤트 발생
      console.log(item.name + " : " + item.message);
     io.emit("receive message", { name: item.name, message: item.message });
     //클라이언트에 이벤트를 보냄
   });
})


module.exports = app