const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({

  // 소켓 db schema 생성
  name: {
    type: String
  },
  message: {
    type: String
  }
  
});

module.exports = mongoose.model("Chat", ChatSchema);
