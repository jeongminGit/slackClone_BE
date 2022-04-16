const mongoose = require('mongoose');


const roomSchema = new mongoose.Schema({
  users: String,
  owner: String,
  createdAt: {
    type: Date,
    defalt: Date.now(),
  },
},
{
  timestamps: true
}
);


roomSchema.virtual("roomId").get(function () {
  return this._id.toHexString(); 
}); 
roomSchema.set("toJSON", {
  virtuals: true, 
});


module.exports = mongoose.model('Room', roomSchema);
