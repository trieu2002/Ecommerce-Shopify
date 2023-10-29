const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
// hàm kiếm tra xem người dùng đã đăng nhập hay chưa
const verifyToken = asyncHandler((req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send('invalid request'); //invalid request
            } else {
                // nếu mà đăng nhập rồi thì ta gán access token cho req.user
                req.user = jwt.verify(authorization[1], process.env.JWT_SECRET_KEY);
                return next();
            }
        } catch (err) {
            return res.status(403).send("invalid token"); //invalid token
        }
    } else {
        return res.status(401).send('invalid request');
    }
});
const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(404).json({
            success: false,
            message: "Requied Admin"
        })
    }
    next();
});
module.exports = {
    verifyToken,
    isAdmin
}