const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../schemas/user');
const Room = require('../schemas/room'); 
const Chat = require('../schemas/chat');

const router = express.Router();

// DirectMessage_Room: 클라이언트에 채팅방 리스트보내기
router.get('/', async (req, res, next) => { //==============> 프론트에서 확인 주소:"message/"
  try {

    // 헤드로 받아온 id를 기준으로 다이렉트메시지방을 보여주기... (보류)
    const {user} = res.locals; //===================================> 로그인 연결되어야확인이 가능함... ㅠㅠ



    const rooms = await Room.find({});

    // 'main'은 main.html를 가리킴 ===================================> 프론트에서 확인
    res.render('main', { rooms, users:'채팅방 생성' });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// DirectMessage_Room: 메인화면 '채팅방생성'버튼 클릭시 정보보내기
router.get('/room', (req, res) => {
  res.render('room', { users: '채팅방 생성' });
  console.log
});


// DirectMessage_Room: 생성화면 '생성'버튼 클릭시 정보보내기 (친구추가 부분)
router.post('/room', async (req, res, next) => {
  try {
    
    // 1. 친구리스트 주기 (메시지방 생성시 친구검색시 나오는 친구리스트)
    const users = await User.find({});
    // const userlist = users.userId
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
    const newRoom = await Room.create({
      users: req.body.users,     //========================================> 프론트에서 
      owner: req.session.color,    //========================================> 쿠키 변경시 확인
      isShown: "true",   
    });

  
    const io = req.app.get('io');
    io.of('/message/room').emit('newRoom', newRoom, userlist); //=============> 프론트 확인사항 (main.html , 44번에서 확인)
    res.redirect(`/message/room/${newRoom._id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// DirectMessage_Room: 메시지방 들어갈때 정보보내기 
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    const chats = await Chat.find({ room: room._id }).sort('createdAt');   
    return res.render('chat', {               //========================================> 프론트 확인사항 (chat.html)
      room,
      users: room.users,
      chats,
      user: req.session,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


// // DirectMessage_Room: 메시지방 삭제 
// router.delete('/room/:id', async (req, res, next) => {
//   try {
//     await Room.remove({ _id: req.params.id });
//     await Chat.remove({ room: req.params.id });
//     res.send('ok');
//     setTimeout(() => {
//       req.app.get('io').of('/message/room').emit('removeRoom', req.params.id); 
//     }, 2000);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });


// DirectMessage_Room: 채팅 DB 저장하기
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,       //========================================> 로그인 연결시 진행상황
      chat: req.body.chat,
    });
    console.log(chat)
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
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
