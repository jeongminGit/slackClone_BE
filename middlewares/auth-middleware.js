const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = authorization.split(" ");
    console.log(authorization)

    if (!authToken || authType !== "Bearer") {
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.1",
        });
        return;
    }
 
    try {
        const { userId } = jwt.verify(authToken,process.env.JWT_SECRET); 
  
        User.findOne({userId}).exec().then((userId) => {
            res.locals.user = userId;
            next();
        });

    } catch (error) {          
        res.status(401).json({
            errorMessage: "로그인 후 이용 가능한 기능입니다.2",
        });
        return;
    }
};

