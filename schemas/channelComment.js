const mongoose = require("mongoose");

const channelCommentSchema = new mongoose.Schema({
  // postId: {
  //   type: String,
  //   unique: true, //유니크 값
  //   required: true, //필수 값
  // },
  commentId: {
    //댓글작성자 고유 아이디값
    type: String,
    // required: true, //필수 값
  },
  userNickname: {
    //유저 닉네임
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
});
channelCommentSchema.virtual("channelCommentId").get(function () {     
  return this._id.toHexString();
});
channelCommentSchema.set("toJSON", {
  virtuals: true, });


module.exports = mongoose.model("ChannelComment", channelCommentSchema);

