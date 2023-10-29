const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const { generatorAccessToken, generatorRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, mobile } = req.body;
    if (!firstname || !lastname || !email || !password || !mobile) {
        return res.status(400).json({
            success: false,
            message: "Missing input"
        });
    };
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new Error("User đã tồn tại");
    } else {
        const response = await User.create(req.body);
        return res.status(200).json({
            success: response ? true : false,
            data: response ? response : "Tạo tài khoản thất bại"
        });
    }

});
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    /**
     * Validate dữ liệu người dùng gửi lên khi đăng nhập
     */
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing input"
        });
    };
    /**
     * Kiểm tra xem email người dùng đăng kí đã tồn tại hay chưa
     */
    const response = await User.findOne({ email });


    if (!response) {
        throw new Error("Tài khoản chưa được đăng kí")
    };
    /**
     * Kiểm tra mật khâu người dùng gửi lên có trùng với mk trong db
     */
    const isValidPassword = await response.isCorrectPassword(password);
    if (!isValidPassword) {
        throw new Error("Mật khẩu sai");
    }

    if (response && isValidPassword) {
        /**
         * Xóa trường password,role ra khỏi object trả về
         */
        const { password, role, ...userData } = response.toObject();
        const token = generatorAccessToken(response._id, response.role);
        // tạo ra refresh token
        const refreshToken = generatorRefreshToken(response._id);
        // lưu refresh token vào db
        await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
        // lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            userData,
            token
        })
    } else {
        throw new Error("Đăng nhập thất bại")
    }

});
// lấy ra thông tin của User
const getProfile = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select("-refreshToken -password -role");
    return res.status(200).json({
        success: user ? true : false,
        message: user ? user : "Lấy thông tin thất bại"
    });

});
const refreshToken = asyncHandler(async (req, res) => {
    // lấy token từ cookie
    const cookie = req.cookies;
    // check xem token có tồn tại hay không
    if (!cookie && !cookie.refreshToken) throw new Error("No refreshtoken in cookie");
    // check token có hợp lệ hay không
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET_KEY, async (err, decode) => {
        if (err) throw new Error("Invalid refresh token");
        // check token có khớp với token lưu trong db
        const response = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken });
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generatorAccessToken(response._id, response.role) : "Error"
        })


    });
});
const logout = asyncHandler(async (req, res) => {
    // lấy token từ cookie
    const cookie = req.cookies;
    // kiểm tra sự tồn tại của token
    if (!cookie && !cookie.refreshToken) throw new Error("No refreshtoken in cookie");
    // xóa token trong db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" }, { new: true });
    // xóa token ở trên trình duyêt
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        super: true,
        message: "Đăng xuất thành công"
    })
});
// code api quên mật khẩu
/**
 * Client gửi lên cho email (người dùng dki)=>server check email có hợp lệ hay không
 * Hợp lệ gửi email cho người dùng (password token)
 * Client check mail -> Click link
 * Client gửi api kèm theo token (pasword token)
 * Server check xem có giống token mà server gửi email hay không
 */
const forgotPassword = asyncHandler(async (req, res) => {
    // lấy ra email của client gửi lên
    const { email } = req.query;
    // check xem email có hợp lệ
    if (!email) throw new Error("Missing Email");
    // kiểm tra xem email client gửi lên có trong db hay không
    const existEmail = await User.findOne({ email });
    if (!existEmail) throw new Error("User not found");
    // tạo resetToken 
    const resetToken = await existEmail.createPasswordChangeToken();
    console.log('<<<<<<< resetToken >>>>>>>', resetToken);
    // lưu vào db
    await existEmail.save();
    // gửi email
    const html = `Xin vui lòng click vào link sau dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_CLIENT}/api/v1/user/reset-password/${resetToken}>Click</a>`;
    const data = {
        email,
        html
    };
    // gọi email
    const rs = await sendMail(data);
    console.log('<<<<<<< rs >>>>>>>', rs);
    return res.status(200).json({
        success: true,
        rs
    });


});
const resetPassword = asyncHandler(async (req, res) => {
    // lấy ra token và mật khẩu mới client gửi lên 
    const { token } = req.body;
    const { password } = req.body;
    // tạo ra token reset 
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('<<<<<<< passwordResetToken >>>>>>>', passwordResetToken);
    // kiểm tra xem token reset có khớp với trong db
    const user = await User.findOne({ passwordResetToken });
    console.log('<<<<<<< user >>>>>>>', user);
    if (!user) throw new Error("Invalid reset token");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? "Cập nhật mật khẩu thành công" : "Thất bại"
    })

});
/**
 * CRUD User
 */
const getUser = asyncHandler(async (req, res) => {
    const response = await User.find().select("-password -refreshToken -role");
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
});
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error("Missing input");
    const response = await User.findByIdAndDelete(id);
    return res.status(200).json({
        success: response ? true : false,
        users: response ? "Xóa thành công" : "Xóa thất bại"
    })
});
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error("Missing input");
    const response = await User.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        users: response ? "Cập nhật thành công" : "Cập nhật thất bại"
    })
});
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) throw new Error("Missing input");
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        users: response ? "Cập nhật thành công" : "Cập nhật thất bại"
    })
});
module.exports = {
    register,
    login,
    getProfile,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getUser,
    deleteUser,
    updateUserByAdmin,
    updateUser
}