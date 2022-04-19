const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: {
    //채널 이름
    type: String,
    // required: true, //필수 값
  },
  channelHost: {
    //채널  만든사람
    type: String,
  },
  createdAt: {
    //날짜
    type: String,
  },
  isPublic: {
    //권한설정
    type: Boolean,
  },
  contentList: {
    //내용리스트
    type: Array,
  },
  userList: {
    //유저리스트
    type: Array,
  },
});
  channelSchema.virtual("channelId").get(function () {     
    return this._id.toHexString();
 });
  channelSchema.set("toJSON", {
    virtuals: true, });
module.exports = mongoose.model("Channel", channelSchema);



