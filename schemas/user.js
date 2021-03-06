const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    required: true
  },
  userId: {
    type: String
  }

  
  
});

module.exports = mongoose.model("User", UserSchema);
