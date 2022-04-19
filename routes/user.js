const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user")
const Joi = require("joi")
// const cors = require('cors')
const bcrypt = require('bcrypt')
const authMiddleware = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");
// const { json } = require("json")
const { NONAME } = require("dns");
// const corsOptions = {
//     origin: '*',
//     // credentials: true
// };
const router = express.Router();
// router.use(cors(corsOptions));

//  회원 가입 양식
const registerSchema = Joi.object({
    email: Joi
        .string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    nickname: Joi
        .string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9가-힣]{2,20}$/)),//영문(대소문자) 한글 숫자 2~20자
    password: Joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/)),//영문(대소문자) + 최소 1개의 숫자 혹은 특수 문자 8~20자
    passwordCheck: Joi
        .string()
        .required()
})

//회원가입
router.post("/signup", upload.single('image'), async (req, res) => {
    const basicImg = 'https://slackclone-be.s3.ap-northeast-2.amazonaws.com/profileImg/basic_profile.png'
    console.log(req.file)
    try {
        const { email, nickname, password, passwordCheck } = await registerSchema.validateAsync(req.body)
        // const { email, nickname, password, passwordCheck } = req.body
        if (password.includes(nickname)) {
            res.status(400).send({
                errorMessage: "사용자의 이름은 비밀번호에 사용할 수 없습니다."
            })
            return;
        }

        if (password !== passwordCheck) {
            res.status(400).send({
                errorMessage: '비밀번호가 동일하지 않습니다.',
            })
            return;
        }

        const existId = await User.find({ email })
        if (existId.length) {
            res.status(400).send({
                errorMessage: '이미 사용 중인 이메일입니다.'
            })
            return;
        }

        if (req.file == null || undefined) {
            var profileImg = basicImg
            console.log(profileImg)
        } else {
            var profileImg = req.file.location;
            console.log(profileImg)
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = new User({ email, nickname, password: hashed, profileImg })
        await user.save()
        console.log(user)
        res.status(201).send({ result: 'success' })

    } catch (err) {
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        })
        return


        //     let whatError = err.details[0].message
        //     // let whatError = err
        //     console.log(whatError)

        //     if (whatError.includes('email')) {
        //         res.status(400).send({
        //             errorMessage: '이메일 형식을 확인해주세요.'
        //         })
        //     }
        //     if (whatError.includes('nickname')) {
        //         res.status(400).send({
        //             errorMessage: '이름 형식을 확인해주세요.'
        //         })
        //     }
        //     if (whatError.includes('password')) {
        //         res.status(400).send({
        //             errorMessage: '비밀번호 형식을 확인해주세요.'
        //         })
        //     }
        // })

    }
})

    //로그인, 토큰생성
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            res.status(401).send({
                errorMessage: "존재하지 않는 이메일입니다."
            })
            return
        } else {
            const correctPassword = await bcrypt.compareSync(password, user.password)//hash 값과 req값을 비교해서 일치하면 true 출력
            console.log(correctPassword)
            if (correctPassword) {
                const token = jwt.sign({ email: user.email }, `${process.env.KEY}`);
                const nickname = user.nickname;
                const profileImg = user.profileImg;
                res.status(200).send({
                    result: "success",
                    token,
                    // email,
                    // nickname,
                    // profileImg
                })
            } else {
                res.status(400).send({ errorMessage: '비밀번호를 확인해주세요.' })
            }
        }
    })

    // 아이디, 닉네임 중복확인
    router.post('/idCheck', async (req, res) => {
        const { email, nickname } = req.body;

        const existUsers = await User.find({
            $or: [{ email }, { nickname }],
        });
        if (existUsers.length) {
            res.send({
                alert: "이메일 또는 아이디를 다시 입력해주세요."
            });
            return;
        }

        res.send({
            alert: '사용 가능합니다.'
        });
    });

    router.get("/getuser", authMiddleware, async (req, res) => {
        const { user } = res.locals;
        const token = jwt.sign({ email: user.email }, `${process.env.KEY}`);
        console.log(user[0], token)
        res.send({
            email: user[0].email,
            nickname: user[0].nickname,
            profileImg: user[0].profileImg,
            token: token
        });
    });

    module.exports = router;