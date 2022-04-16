const mongoose = require("mongoose");
const moment = require("moment");

const UserSchema = new mongoose.Schema({
  userId: String,
  nickName: String,
  hashedpassword: String,
  startTime: String,
  totalTime:Number,
  connecting:Boolean,
  userImage:String,
  statusMeg:String,
  friendList:[],
});

module.exports = mongoose.model("User", UserSchema);