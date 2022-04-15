const express = require("express");
const Messages = require("../schemas/messages.js");
const {ObjectId} = require("mongodb")
const router = express.Router();
// const authMiddleware = require("../middlewares/auth-middleware");


// // Comment조회: 클라이언트에 보내기
// router.get('/:user/comments',authMiddleware, async (req, res) => {
//     let userId = req.params.user
//     const comment = await Comments.find({userId}).exec();
//     console.log(comment)
//     res.json(comment);
    
// });

// // Comment추가
// router.post('/:user/comments',authMiddleware, async (req, res) => {
//     const{ writer, nickName, content, date, userId} = req.body

//     const comment = await Comments.create({writer, nickName, content, date, userId})
//     console.log(comment)
//     return res.status(200).send({msg: 'success',comment });
// });


// // Comment삭제 
// router.delete('/:user/comments',authMiddleware, async (req, res) => {
//     const{ commentId, userId} = req.body
//     console.log(commentId, userId)

//     await Comments.deleteOne({ _id: ObjectId(commentId) });
//     return res.status(200).send({msg: '완료' });
// });




module.exports = router;