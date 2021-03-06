const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({

  // μμΌ db schema μμ±
  nickname: {
    type: String
  },
  message: {
    type: String
  },
  createdAt: {
    type: String
  },
  profileImg: {
    type: String
  },
  roomName: {
    type: String
  }
  
});

module.exports = mongoose.model("Chat", ChatSchema);
