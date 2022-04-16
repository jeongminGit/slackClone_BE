const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    messageRm: String,
    writer: String,
    nickName: String,
    content: String,
    date: String,
    userId: String,
});

messageSchema.virtual("messageId").get(function () {
     return this._id.toHexString(); 
}); 
messageSchema.set("toJSON", {
     virtuals: true, 
});

module.exports = mongoose.model('Messages', messageSchema);