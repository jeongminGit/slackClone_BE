const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  // postId: {
  //   type: String,
  //   unique: true, //유니크 값
  //   required: true, //필수 값
  // },
  channelId: {
    //채널 사용자
    type: String,
    // required: true, //필수 값
  },
  channelName: {
    //채널 이름
    type: String,
    // required: true, //필수 값
  },
  nickname: {
    //닉네임
    type: String,
  },
  channelHost: {
    //채널  만든사람
    type: String,
  },
  createdAt: {
    //날짜
    type: String,
  },
  content: {
    //게시글 내용
    type: String,
    // required: true, //필수 값
  },
  contentId: {
    //게시글 제목
    type: String,
    // required: true, //필수 값
  },
  userId: {
    //유저 아이디
    type: String,
    // required: true, //필수 값
  },
  nickname: {
    //닉네임
    type: String,
    // required: true, //필수 값
  },
  profileImag: {
    //이미지
    type: String,
  },
  isEdit : {
    type: Boolean,
  },
  isPublic: {
    //권한설정
    type: Boolean,
    // required: true, //필수 값
  },
  allList: {
    //모든리스트
    type: Array,
  },
  contentList: {
    //내용리스트
    type: Array,
  },
  commentList: {
    //댓글리스트
    type: Array,
  },
});

module.exports = mongoose.model("Channel", channelSchema);

