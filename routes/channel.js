const express = require("express");
const bodyParser = require("body-parser");
const Channel = require("./schemas/channel");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());




//채널 유저 아이디 조회
router.get("/channel/:userId", async (req, res) => {
    const Channel = await Channel.find();
    res.json({ userId });
  });



//채널 생성
router.post("/channel/:channelId",  async (req, res) => {
    //authmiddlewares,
    const { channelName, channelDesc,channelId } = req.body;
    const { user } = res.locals;
    const userList =user.userList;
    // const isPublic = JSON.parse("true");
    // isPublic : true,
    console.log(channelName,channelDesc,userList)
    await Channel.create({
      channelName,
      channelDesc,
      userList,
      channelId
    });
    res.json({ channelName, channelDesc});
  });



  //채널 삭제

router.delete("/channel/:channelId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { channelName } = req.params;
    await Channel.deleteOne({ channelName });
    res.send({ result: '삭제완료' });
  })
  




//ContentInChannel


//채널 내용
router.post("/channel/:channelId", async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const content = req.body;
    // console.log(content)
    await ChannelContent.create({
        content
    });
    res.json({content});
}),



//채널 내용 수정
router.patch('/:channel/:contentId', auth, async (req, res) => {
  const { user } = res.locals;
  const { postId } = req.params;
  const { title, tag, contents, introduce,  } = req.body;
  const targetPost = await Post.findOne({ _id: postId });

  if (!targetPost) {
      return res.status(400).json({
          message: '다시 시도해주세요.',
      });
  } else {
      if (user.userId === targetPost.userId) {
          await Post.updateOne(
              { _id: postId },
              { $set: { title, tag, contents, thumbnail, introduce } }
          );
          res.status(200).json({
              message: '게시물이 수정되었습니다.',
          });
      } else {
          return res.status(400).json({
              message: '수정 권한이 없습니다.',
          });
      }
  }
});
















  module.exports = router;