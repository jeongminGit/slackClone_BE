const express = require("express");
const bodyParser = require("body-parser");
const Channel = require("../schemas/channel");
const ChannelContent = require("../schemas/channelContent");
const ChannelComment = require("../schemas/channelComment");
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const moment = require("moment")

//channel

//채널 조회
router.get("/channel/:userId", async (req, res) => {
    const {userId} = req.params
    // console.log({userId})
    const channels = await Channel.find({userList:userId});
    // console.log(channels)
    res.json({ List : channels });
  });

//채널아이디 (new Date().getTime()+""),
// const moment = require(~~)
// createAt :moment()
// const now = moment().format("YYYY-MM-DD-HH:mm");




//채널 생성
router.post("/channel/channel",  async (req, res) => {
    //authmiddlewares,
    const { channelName,  channelHost } = req.body;
    const createdAt = moment().format("YYYY_MM_DD_HH:mm");
    // const { user } = res.locals;
    // const userList =user.userList;
    // const isPublic = JSON.parse("true");
    // console.log(channelName,createdAt,channelHost)
    const result=[await Channel.create({
      channelName,
      createdAt,
      userList: [channelHost],
      channelHost,
      contentList:[]
    })];
    res.json({result});
    // console.log(result)
  });



//   "channelName":"test1",
//   "createdAt":"test2",
//   "userList": "[channelHost]",
//   "channelHost":"test3",
//   "contentList":[]




  //채널 수정 API
  router.patch("/channel/:channelId",(async (req, res) => {
    const { channelId } = req.params;
    const {channelName} = req.body;
    const channel = await Channel.updateOne( {_id:channelId},
        {
            $set: {
                channelName: channelName,
                
            },
        }
    );
    console.log({channelId})
    console.log({channelName})
    res.send();
   
}));



  //채널 삭제

router.delete("/channel/:channelId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { channelId } = req.params;
    await Channel.deleteOne({ _id:channelId });
    console.log({channelId})
    res.send({ result: '삭제완료' });
  })
  




// //ContentInChannel

//컨텐츠 생성
router.post("/:channelId/content", async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { channelName, nickname, profileImg, content} = req.body;
    const {channelId} = req.params;
    const contentId = Math.random()
    // const up = await Channel.updateOne(
    //     { channelId  },
        
    //     { $addToSet: { contentList:`${contentId}` }}
    // );
    const channel = await Channel.findOne({  _id:channelId })
    // console.log(channel,"dd")
    channel.contentList.push(contentId)   
    const doc = await channel.save()
    const createdAt = moment().format("YYYY_MM_DD_HH:mm");
    // console.log(content)
    const contentList =[await ChannelContent.create({
        channelName,
        contentId,
        nickname,
        profileImg,
        content,
        createdAt,
        isEdit : false,
        commentList:[]
    })];
    // console.log(contentList)
    res.json({contentList});
}),

//  "channelId": "625d33e5838e2ff086197c83"
// "channelContentId": "625d215cf1a740fa3136bc87"
//   "contentId":"11",
//   "nickname":"22",
//   "profileImg":"33",
//   "content":"44",
//   "createdAt":"55",
//   "isEdit" : false,
//   "commentList":[]




//채널 내용 수정
router.patch('/:channelId/:contentId', async (req, res) => {
//   const {user} = res.locals
  const { contentId } = req.params;
  const {  content  } = req.body;
  await ChannelContent.updateOne({ contentId },{ $set: { content } });
          res.status(200).json({
              message: '게시물이 수정되었습니다.',
          });
});




//컨텐츠 삭제


router.delete("/:channelId/:contentId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { contentId } = req.params;
    await ChannelContent.deleteOne({ contentId });
    res.send({ result: '삭제완료' });
  })


//CommentInchannel

//댓글 작성
router.post("/:channelId/:contentId/comment", async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const {comment} = req.body;
    console.log({comment})
    // const {user} =res.locals
     const createdAt = moment().format("YYYY_MM_DD_HH:mm");
    console.log(comment)
    commentList = [await ChannelComment.create({
        // user,
        // userNickname:user.userNickname,
        createdAt,
        comment,
        

    })];
    res.json({commentList});
}),

// 댓글삭제

router.delete("/channelId/:contentId/:commentId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { commentId } = req.params;
    await Channel.deleteOne({ commentId });
    res.send({ result: '삭제완료' });
  })


  module.exports = router;













  module.exports = router;