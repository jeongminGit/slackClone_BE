const mongoose = require("mongoose");

const channelContentSchema = new mongoose.Schema({
  contentId: {
    //게시글 내용
    type: String,
    // required: true, //필수 값
  },
  userNickname: {
    //유저 닉네임
    type: String,
    // required: true, //필수 값
  },
  profileImg: {
    //프로필 이미지
    type: String,
    // required: true, //필수 값
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
  commentList: {
    //댓글 리스트
    type: Array,
  },
  isEdit: {
    // (수정시 수정됨으로 뜨는 표시)
    type: Boolean,
  },
  channelId: {
    type: String,
  },
});


module.exports = mongoose.model("ChannelContent", channelContentSchema);

