const SocketIO = require('socket.io');
const axios = require('axios');
// const cookieParser = require('cookie-parser');
// const cookie = require('cookie-signature');

module.exports = (server, app) => {
  console.log('hey')
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);
  const room = io.of('/message/room');
  const chat = io.of('/message/chat');
  
  // // //수정이 필요한곳!
  // io.use((socket, next) => {
  //   console.log('읽어줘', socket)
  //   // cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
  //   // requestMiddleware(socket.request, socket.request.res, next);
  // });

  // io.on("connection", (socket) => {
  //   //     console.log("연결됨!", new Date())
  // });

  // room.on('connection', socket => {
  //   console.log('room 네임스페이스에 접속');
  //   // socket.on('disconnect', () => {
  //   //   console.log('room 네임스페이스 접속 해제');
  //   // });
  // });

  room.use((socket, next) => {
    console.log('읽어줘', socket.request, next)
    requestMiddleware(socket.request, socket.request.res, next)
    // cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
    // requestMiddleware(socket.request, socket.request.res, next);
  });

  // room.on('connection', (socket) => {
  //   console.log('room 네임스페이스에 접속');
  //   socket.on('disconnect', () => {
  //     console.log('room 네임스페이스 접속 해제');
  //   });
  // });


  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    socket.join(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session}님이 입장하셨습니다.`
    //   chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) { // 유저가 0명이면 방 삭제
        // const signedCookie = cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET); //문제있다 문제있어! 
        // const connectSID = `${signedCookie}`;
        axios.delete(`http://localhost:8005/message/room/${roomId}`, {
          headers: {
            Cookie: `connect.sid=s%3A${connectSID}`
          } 
        })
        //   .then(() => {
        //     console.log('방 제거 요청 성공');
        //   })
          .catch((error) => {
            console.error(error);
          });
    //   } else {
    //     socket.to(roomId).emit('exit', {
    //       user: 'system',
    //       chat: `${req.session.color}님이 퇴장하셨습니다.`,
    //     });
      }
    });
    socket.on('chat', (data) => {
      socket.to(data.room).emit(data);
    });
  });
};
