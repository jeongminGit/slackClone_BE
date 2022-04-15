const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  // postId: {
  //   type: String,
  //   unique: true, //유니크 값
  //   required: true, //필수 값
  // },
  channelName: {
    //채널 이름
    type: String,
    required: true, //필수 값
  },
  channelDesc: {
    //채널 설명
    type: String,
  },
  title: {
    //게시글 제목
    type: String,
    required: true,
  },
  content: {
    //게시글 내용
    type: String,
    required: true, //필수 값
  },
  contentId: {
    //게시글 아이디
    type: String,
    required: true, //필수 값
  },
  imageUrl: {
    //이미지
    type: String,
  },
  date: {
    type: String,
  },
  isPublic: {
    //권한설정
    type: Boolean,
    required: true, //필수 값
  },
  uerList: {
    //유저리스트
    type: Array,
  },
});

module.exports = mongoose.model("Channel", channelSchema);

