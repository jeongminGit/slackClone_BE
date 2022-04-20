const express = require("express");
const {ObjectId} = require("mongodb")
const bodyParser = require("body-parser");
const User = require("../schemas/user")
const Channel = require("../schemas/channel");
const ChannelContent = require("../schemas/channelContent");
const ChannelComment = require("../schemas/channelComment");
const authMiddleware = require("../middlewares/auth");
const router = express.Router()
const moment = require("moment");
const { listeners } = require("process");
require("moment-timezone");
moment.tz.setDefault("Asia/seoul")



//채널 조회 API
router.get("/channel/:userId",authMiddleware, async (req, res) => {
    const {userId} = req.params

    const channels = await Channel.find({});
    const contents = await ChannelContent.find({});
    const comments = await ChannelComment.find({});

    console.log(channels)

    let newDic = {
        channel : channels,
        content : contents,
        comment : comments
    }

    return res.status(200).send(newDic);
  });



//채널 생성 API
router.post("/channel/channel",authMiddleware, async (req, res) => {
    const { channelName,  nickname } = req.body;
    const createdAt = moment().format("YYYY-MM-DD HH:mm");
        
    const isPublic = JSON.parse("true");

    const result= await Channel.create({
      channelName,
      createdAt,
      userList: [nickname],
      channelHost: nickname,
      contentList:[]
    });

    return res.status(200).json(result);

});


//채널 수정 API
router.patch("/channel/:channelId",authMiddleware, async(req, res) => {
    const { channelId } = req.params;
    const {channelName} = req.body;
    console.log(channelId, channelName)

    const channel = await Channel.updateOne({_id:channelId},
        {$set:{channelName: channelName}}
    );

    return res.status(200).send({msg: "success"});
});


//채널 삭제 API
router.delete("/channel/:channelId",authMiddleware, async(req, res) => {
    const { channelId } = req.params;

    await Channel.deleteOne({ _id:channelId });

    return res.status(200).send({msg: "success"});
});




//게시글 생성 API
router.post("/:channelId/content",authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { content } = req.body;
    const { channelId } = req.params;

    const contentId = Math.random().toString(36).substr(3)
    const createdAt = moment().format("YYYY-MM-DD HH:mm")

    const channel = await Channel.findOne({  _id:channelId })
    channel.contentList.push(contentId)       
    await channel.save()

    const contentList =[await ChannelContent.create({
        channelName: channel.channelName,
        contentId,
        userNickname: user[0].nickname,
        profileImg: user[0].profileImg,
        content,
        createdAt,
        isEdit : false,
        commentList:[]
    })];
  
    return res.status(200).json(contentList);
});


//게시글 수정 API
router.patch('/:channelId/:contentId',authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { contentId } = req.params;
    const {  content  } = req.body;

    const editContent = await ChannelContent.updateOne({ contentId },{ $set:{content :content, isEdit: true} });
    
    const sendContent = await ChannelContent.findOne({contentId},    
        {_id:0, contentId:1, content:1, createdAt:1, isEdit:1 })
    
    return res.status(200).json(sendContent);
});
    


// 게시글 삭제 API
router.delete("/:channelId/:contentId", async (req, res) => {    
    const { channelId, contentId } = req.params;

    // Channel에서 Content 삭제
    const channel = await Channel.findOne({ _id: channelId})
    const lists = []

    for (const content of channel.contentList){

        if (content !== contentId){
            lists.push(content)
        } 
    }
    channel.contentList = lists;
    const doc = await channel.save()

    //Content 삭제
    await ChannelContent.deleteOne({contentId});

    return res.status(200).send({ msg: 'success' });
})



// 댓글 생성 API
router.post("/:channelId/:contentId/comment",authMiddleware, async (req, res) => {
    const { contentId  } = req.params;
    const { comment } = req.body;
    const {user} =res.locals

    const commentId = Math.random().toString(36).substr(3)
    const createdAt = moment().format("YYYY-MM-DD HH:mm");
   
    // ProfileImg  //로그인 통합후 authmiddleware와 함께 오픈!
    const userinfo = await User.findOne({user})  
    console.log(userinfo)

    // Content에 Comment 추가
    const content = await ChannelContent.findOne({contentId})
    content.commentList.push(commentId) 
    await content.save()

    // Comment 추가
    savecomment = await ChannelComment.create({
        userNickname:user[0].nickname,
        profileImg: user[0].profileImg,
        createdAt,
        comment,
        commentId,
        isEdit: false,
        contentId,
    });

    return res.status(200).json(savecomment);
}),



// 댓글 삭제 (문희)
router.delete("/:channelId/:contentId/:commentId",authMiddleware, async (req, res) => {
    const { contentId, commentId } = req.params;

    //Content에서 Comment 삭제
    ChannelContent.findOneAndUpdate(
        { contentId },
        { $pull: {commentList: commentId}},
        { new: true},
        function(err) {
            if(err) {console.log(err)}
        }
    )

    //Comment 삭제
    await ChannelComment.deleteOne({ commentId: commentId });
    return res.status(200).send({ msg : "success"});
});


module.exports = router;
