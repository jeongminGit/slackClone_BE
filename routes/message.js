const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SocketIO = require('socket.io');
const app = express();
var server = require('http').createServer(app);
const io = SocketIO(server, { path: '/socket.io' });
const User = require('../schemas/user');
const Room = require('../schemas/room'); 
const Chat = require('../schemas/chat');
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

app.set('io', io);

// DirectMessage_Room: 클라이언트에 채팅방 리스트보내기
router.get('/',async (req, res, next) => { //==============> 프론트에서 확인 주소:"message/"
  try {
    
    const {user} = res.locals; 
    console.log(user.userId)

    const rooms = await Room.find({users: user.userId});
  

    // 'main'은 main.html를 가리킴 ===================================> 프론트에서 확인
    res.render('main', { rooms, users:'채팅방 생성' });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// DirectMessage_Room: 메인화면 '채팅방생성'버튼 클릭시 정보보내기
router.get('/room',authMiddleware, (req, res) => {
  // 'room'은 room.html를 가리킴 ===================================> 프론트에서 확인
  res.render('room', { users: '채팅방 생성' });
  console.log
});


// DirectMessage_Room: 생성화면 '생성'버튼 클릭시 정보보내기 (친구추가 부분)
router.post('/room',authMiddleware, async (req, res, next) => {
  try {
    // 1. 친구리스트 주기 (메시지방 생성시 친구검색시 나오는 친구리스트)
    const users = await User.find({});
  
    const userlist = [];
    for (const user of users){
      const info = await User.find({ userId :user.userId},    
        {_id:0, userId:1, nickName:1})
      userlist.push(info[0])
    }
              //아래 전달값
              //  [
              //   { userId: 'test3', nickName: '테스트입니다' },
              //   { userId: 'test4', nickName: '테스트입니다' }
              //   ]

     // 2. 친구추가 부분 (프론트에서 리스트를 보내줘야 가능)
     const {user} = res.locals; 
      const newRoom = await Room.create({
        users: [req.body.users],     //========================================> 프론트에서 
        owner: user.userId,   
        isShown: "true",   
      });
  
    const io = req.app.get('io');
    io.of(`/message/room/${newRoom._id}`).emit('newRoom', newRoom); //=====> 프론트 확인사항 ("newRoom": 새로운방 생성)
    res.redirect(`/message/room/${newRoom._id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// DirectMessage_Room: 메시지방 들어갈때 정보보내기 
router.get('/room/:id',authMiddleware, async (req, res, next) => {
  try {
    const {user} = res.locals;
    console.log(user.userId,'<<<<<<')
    const room = await Room.findOne({ _id: req.params.id });
    console.log(room)
    const io = req.app.get('io');
    const chats = await Chat.find({ room: room._id }).sort('createdAt'); 
    console.log(chats)  
    return res.render('chat', {               //===================> 프론트 확인사항 (chat.html)
      room,
      users: room.users,
      chats,
      user: user.userId,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


// DirectMessage_Room: 채팅 DB 저장하기
router.post('/room/:id/chat',authMiddleware, async (req, res, next) => {
  try {
    const {user} = res.locals;
    const chat = await Chat.create({
      room: req.params.id,
      user: user.userId,      
      chat: req.body.chat,
    });
     req.app.get('io').of('message/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

try {
  fs.readdirSync('uploads');
} catch (err) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});


// GIF 사진 올리기
// router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
//   try {
//     const chat = await Chat.create({
//       room: req.params.id,
//       user: req.session.color,
//       gif: req.file.filename,
//     });
//     req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
//     res.send('ok');
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
