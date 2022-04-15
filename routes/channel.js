const express = require("express");
const bodyParser = require("body-parser");
const Channel = require("../schemas/channel");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());




//채널 유저 아이디 조회
router.get("/channel/:userId", async (req, res) => {
    const Channel = await Channel.find();
    res.json({ userId });
  });



//채널 생성
router.post("/channel/:channelId", authmiddlewares, upload.single('imageUrl'), async (req, res) => {
    
    const { channelName, channelDesc } = req.body;
    const { user } = res.locals;
    const userList =user.userList;
    // isPublic? Boolean
    console.log(channelName,channelDesc,userList)
    await Post.create({
      channelName,
      channelDesc,
      userList
    });
    res.json({ channelName, channelDesc});
  });



  //채널 삭제

router.delete("/channel/:channelId", authMiddleware, async (req, res) => {
    const { channelName } = req.params;
    await Channel.deleteOne({ channelName });
    res.send({ result: '삭제완료' });
  })
  














  module.exports = router;