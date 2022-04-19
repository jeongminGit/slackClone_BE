const mongoose = require("mongoose");

const channelCommentSchema = new mongoose.Schema({
  commentId: {
    //댓글작성자 고유 아이디값
    type: String,
    // required: true, //필수 값
  },
  userNickname: {
    //유저 닉네임
    type: String,
  },
  profileImg: {
    //유저 프로필 이미지
    type: String,
  },
  createdAt: {
    //날짜
    type: String,
  },
  comment: {
    //댓글 내용
    type: String,
    // required: true, //필수 값
  },
  isEdit : {
    // (수정시 수정됨으로 뜨는 표시)
    type: Boolean,
  },
  contentId: {
    //콘텐트작성자 고유 아이디값
    type: String,
  },
});


module.exports = mongoose.model("ChannelComment", channelCommentSchema);

