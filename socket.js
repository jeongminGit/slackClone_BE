const SocketIO = require('socket.io');
const axios = require('axios');
const authMiddleware = require("./middlewares/auth");

// mongoose model compile
const Chat = require('./schemas/chat')
// var Chat = mongoose.model('Chat', ChatSchema)

module.exports = (server, app) => {
  console.log('hey')
  const io = SocketIO(server, {path: '/socket.io'});
  app.set('io', io);
  const room = io.of('/room')
  const chat = io.of('/chat')




//소켓추가
chat.on("connection", (socket)=> {
  console.log("연결이되었습니다.")
  Chat.find(function (err, result) {
      for(var i = 0 ; i < result.length ; i++) {
          var dbData = {name : result[i].name, message : result[i].message};
          // io.sockets.sockets[socket.id].emit('preload', dbData);
          console.log(dbData)
      }
  });
  socket.on("init", (payload) => {
      console.log(payload)
  })
  socket.on("send message", (item) => {//send message 이벤트 발생
      console.log(item.name + " : " + item.message);
      io.emit("receive message", { name: item.name, message: item.message });
      var chat = new Chat({ name:item.name, message: item.message });
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

}