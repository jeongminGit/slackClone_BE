const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    writer: String,
    nickName: String,
    content: String,
    date: String,
    userId: String,
    // 수정된 부분: date: date, userId: userID로 된 부분 value 값 string으로 수정
});

messageSchema.virtual("messageId").get(function () {
     return this._id.toHexString(); 
}); 
messageSchema.set("toJSON", {
     virtuals: true, 
});


module.exports = mongoose.model('Messages', messageSchema);