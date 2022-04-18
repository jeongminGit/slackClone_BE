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
    required: true,
    default: 'https://slackclone-be.s3.ap-northeast-2.amazonaws.com/profileImg/basic_profileImg.png'
  }
});

module.exports = mongoose.model("User", UserSchema);
