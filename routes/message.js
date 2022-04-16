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
    const newRoom = await Room.create({ });
    console.log(newRoom._id)
    await Room.updateOne({userId:`${newRoom._id}`},{$addToSet:{friendList:`${friendId}`}})
    console.log(newRoom)
    // const newRoom = await Room.create({
    //   users: req.body.users,
    //   owner: req.session.color,            //========================================> 쿠키 변경시 확인
    // });


    const io = req.app.get('io');
    io.of('/message/room').emit('newRoom', newRoom); //========================================> 프론트 확인사항 (main.html , 44번에서 확인)
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
    return res.render('chat', {                         //========================================> 프론트 확인사항 (chat.html)
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
//     setTimeout(() => {                                     //========================================> 프론트 확인사항 (chat.html)
//       req.app.get('io').of('/message/room').emit('removeRoom', req.params.id); 
//     }, 2000);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });


//
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
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
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
