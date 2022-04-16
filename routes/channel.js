const express = require("express");
const bodyParser = require("body-parser");
const Channel = require("../schemas/channel");
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());





//채널 조회
router.get("/channel/:userId", async (req, res) => {
    const {userList} = req.params
    const channels = await Channel.find({userList});
    res.json({ userList : channels });
  });



//채널 생성
router.post("/channel/:channelId",  async (req, res) => {
    //authmiddlewares,
    const {channelId} = req.params
    const { channelName, channelDesc} = req.body;
    // const { user } = res.locals;
    // const userList =user.userList;
    // const isPublic = JSON.parse("true");
    console.log(channelName,channelDesc,channelId)
    const c = 
    await Channel.create({
      channelName,
      channelDesc,
    //   userList,
    isPublic : true,
      channelId
    });
    res.json({ c});
  });



  //채널 삭제

router.delete("/channel/:channelId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { channelId } = req.params;
    await Channel.deleteOne({ channelId });
    res.send({ result: '삭제완료' });
  })
  




// //ContentInChannel


// //채널 내용
// router.post("/channelId/:content", async (req, res) => {
//     //authMiddleware, upload.single('imageUrl'),
//     const {content} = req.body;
//     console.log(content)
//     await Channel.create({
//         content
//     });
//     res.json({content});
// }),



// // //채널 내용 수정
// // router.patch('/:channelId/:contentId', async (req, res) => {
// // //   const {user} = res.locals
// //   const { contentId } = req.params;
// //   const {  contents  } = req.body;
// //   const targetContent = await content.findOne({ _id: contentId });

// //   if (!targetContent) {
// //       return res.status(400).json({
// //           message: '다시 시도해주세요.',
// //       });
// //   } else {
// //       if (contentId == targetContnent.contentId){//user.userId === targetContent.userId) {
// //           await content.updateOne(
// //               { _id: contentId },
// //               { $set: { contents } }
// //           );
// //           res.status(200).json({
// //               message: '게시물이 수정되었습니다.',
// //           });
// //       } else {
// //           return res.status(400).json({
// //               message: '수정 권한이 없습니다.',
// //           });
// //       }
// //   }
// // });




// //컨텐츠 삭제


// router.delete("/channelId/:contentId",  async (req, res) => {
//     //authMiddleware, upload.single('imageUrl'),
//     const { contentId } = req.params;
//     await Channel.deleteOne({ contentId });
//     res.send({ result: '삭제완료' });
//   })




//댓글 작성
router.post("/:channelId/:contentId/:comment", async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const {comment} = req.body;
    console.log(comment)
    await Channel.create({
        comment
    });
    res.json({comment});
}),



router.delete("/channelId/:contentId/:comment",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { commentId } = req.params;
    await Channel.deleteOne({ commentId });
    res.send({ result: '삭제완료' });
  })


  module.exports = router;













  module.exports = router;