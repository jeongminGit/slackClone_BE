const mongoose = require('mongoose');

const messagermSchema = new mongoose.Schema({
    owner: String,
    prople: [],
    peopleNum: Number,
    createdAt: new Date(),
});

messagermSchema.virtual("messagermId").get(function () {
     return this._id.toHexString(); 
}); 
messagermSchema.set("toJSON", {
     virtuals: true, 
});


module.exports = mongoose.model('MessageRm', messagermSchema);