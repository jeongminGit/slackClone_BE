const express = require("express");
const bodyParser = require("body-parser");
const Channel = require("../schemas/channel");
const ChannelContent = require("../schemas/channelContent");
const ChannelComment = require("../schemas/channelComment");
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const moment = require("moment")







// router.get("/post", async (req, res) => {
//   const Posts = await Post.find();
//   const Comments = await Post.find();
//   res.json({list: Posts});
//   console.log(list)

// const oneChannel = 몽고DB 조회 결과 얻은 하나의 객체
// const b = 몽고DB 조회 해서 이 채널에서 남긴 컨텐츠들 싹다 불러온거
// a = [{"이름"}, {"일반"}, {"홍길동"}, {"추가한채널"}]
// for(let i=0; i<a.length; i++) {
//   oneChannel = a[1]
//   {
//     channelName: "추가한채널",
//     connelHost: "닉네임",
//     createdAt : "2022- -asd-fasdf",
//   }
//   mongoDB 조회
//   const b = 몽고DB 조회 해서 이 채널에서 남긴 컨텐츠들 싹다 불러온거
//   let queryResult = [{
//     contentId: asdf,
//     channelName: "추가한채널",
//     ldkfjdl,
//     .
//     .
//     .
//   },
//   {
//     channelName: "추가한채널",
//   }]
//   let temp_html = {
//     ...oneChannel,
//     contentList: queryResult
//   }
// }
// let searchInDB = [{
//   contentId: asdf,
//   channelName: "일반",
//   ldkfjdl,
// }, {
//   contentId: dff,
//   channelName: "일반",
//   ldkfjdl,
//   content: "적은내용",
// }, {}]
// let temp_html = {
//   ...channelCommon,
//   contentList: searchInDB,
// }
// let newDic = {
//   channelName: channelCommon.channelName,
//   connelHost: channelCommon.connelHost,
//   createdAt: channelCommon.createdAt,
//   contentList: searchInDB,
// }
// console.log(temp_html)
// // 채널 하나의 모든 정보를 불러왔음
// {
//   channelName: "common",
//   connelHost: "닉네임",
//   createdAt : "2022- -asd-fasdf",
//   contentList: [{
//     contentId: asdf,
//     channelName: "일반",
//     ldkfjdl,
//     ..
//     .
//     .
//   }, {
//     contentId: dff,
//     channelName: "일반",
//     ldkfjdl,
//     content: "적은내용",
//     ..
//     .
//   }, {}]
// }











//  //채널 사용자 조회
// router.get('/:channelId/users', async (req, res) => {
//   try {
//       const { channelId } = req.params;
//       const result = await allList.findAll({
//           where: { channelId },
//           include: [{
//               // schemas: channel,
//               order: [['createdAt', 'channelName', 'channelHost']]
//           }]
//       });

//       res.json({ "ok": true, result });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ ok: false, message: "채널 사용자 목록 불러오기를 실패하였습니다." });
//   }
// }); 





// //채널 만들기
// router.post('/channel/userId', async (req, res) => {
//   try {
//       const { channelName, createdAt, channelHost,allList } = req.body;
//       const channel = await Channel.create({
//           channelName,
//           createdAt,
//           channelHost,
//           allList
//       });
//       const contentId = channel.id;
//       for (let i = 0; i < allList.length; i++) {
//           await allList.create({
//               Id: allList[i],
//               contentId,
//           });
//       }

//       const result = await ChannelUserList.findAll({
//           where: { channelId },
//           include: [{
//               model: User,
//               order: [['createdAt', 'DESC']]
//           }]
//       });

//       res.json({ ok: true, message: '채널등록을 성공하였습니다.' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ ok: false, message: '채널등록을 실패하였습니다.' });
//   }
// });






//채널 조회
router.get("/channel/:userId", async (req, res) => {
    const {userId} = req.params
    // console.log({userId})
    const channels = await Channel.find({userList:userId});
    console.log(channels)
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
    console.log(channelName,createdAt,channelHost)
    const result=[await Channel.create({
      channelName,
      createdAt,
      userList: [channelHost],
      channelHost,
      contentList:[]
    })];
    res.json({result});
    console.log(result)
  });














  //게시글 수정 API
  router.patch("/:channelId/:contentId",(async (req, res) => {
    const { contentId } = req.params;
    const content = await contentId.findOne({ contentId: contentId });
    // const userId = res.locals.userId;

    if (content.contentId !== contentId) {
        return res.status(412).json({
            errorMessage: "본인 게시글만 수정 가능합니다.",
        });
    }

    // upload(req, res, async (err) => {
    //     const { content } = req.body;
    //     let imgUrl;

    //     if (req.file) {
    //         imgUrl = req.file.path;
    //     } else imgUrl = post.imgUrl;

        try {
            if (err) {
                return res.json({ success: false, err });
            }
            await content.updateOne(
                { contentId: contentId },
                {
                    $set: {
                        content: content,
                        createdAt: moment(),
                    },
                }
            );
            res.send();
        } catch {
            res.status(400).json({
                errorMessage: "게시글 수정 중 오류 발생",
            });
        }
    // });
}));


  //게시글 수정 API
  router.patch("/:channelId/:contentId",(async (req, res) => {
    const { contentId } = req.params;
    const {  channelName} =req.body;
    const content = await contentId.findOne({ contentId: contentId });
    // const userId = res.locals.userId;

    if (content.contentId !== contentId) {
        return res.status(412).json({
            errorMessage: "본인 게시글만 수정 가능합니다.",
        });
    }

    // upload(req, res, async (err) => {
    //     const { content } = req.body;
    //     let imgUrl;

    //     if (req.file) {
    //         imgUrl = req.file.path;
    //     } else imgUrl = post.imgUrl;

        try {
            if (err) {
                return res.json({ success: false, err });
            }
            await content.updateOne(
                { contentId: contentId },
                { channelName },
            );
            res.send();
        } catch {
            res.status(400).json({
                errorMessage: "게시글 수정 중 오류 발생",
            });
        }
    // });
}));








  //채널 삭제

router.delete("/channel/:channelId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { channelId } = req.params;
    await Channel.deleteOne({ channelId });
    res.send({ result: '삭제완료' });
  })
  




// //ContentInChannel

//"channelId": "625e0e1577d96f9827860288"
//"contentId": "0.9353774031667415"
//채널 내용
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
    console.log(channel,"dd")
    channel.contentList.push(contentId) 
        

const doc = await channel.save()

    


    console.log(doc,"여기!!")

    const createdAt = moment().format("YYYY_MM_DD_HH:mm");
    console.log(content)
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
    console.log(contentList)
  

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
  const {  contents  } = req.body;
  const targetContent = await content.findOne({ _id: contentId });

  if (!targetContent) {
      return res.status(400).json({
          message: '다시 시도해주세요.',
      });
  } else {
      if (contentId == targetContnent.contentId){//user.userId === targetContent.userId) {
          await content.updateOne(
              { _id: contentId },
              { $set: { contents } }
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




//컨텐츠 삭제


router.delete("/channelId/:contentId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { contentId } = req.params;
    await Channel.deleteOne({ contentId });
    res.send({ result: '삭제완료' });
  })



//   625d93344729899b61c3c1e9
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

//"channelCommentId": "625d2aede08f143773d004aa",

router.delete("/channelId/:contentId/:commentId",  async (req, res) => {
    //authMiddleware, upload.single('imageUrl'),
    const { commentId } = req.params;
    await Channel.deleteOne({ commentId });
    res.send({ result: '삭제완료' });
  })


  module.exports = router;













  module.exports = router;