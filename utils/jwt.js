const jwt = require("jsonwebtoken");
const generatorAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
const generatorRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
module.exports = {
    generatorAccessToken,
    generatorRefreshToken
}