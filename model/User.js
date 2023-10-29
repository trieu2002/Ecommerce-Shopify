const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
/**
 * Tạo ra bảng User
 */
const userSchema = new mongoose.Schema({
    /**
     * Ho tên người dùng
     */
    firstname: {
        type: String,
        required: true
    },
    /**
     * Họ tên người dùng
     */
    lastname: {
        type: String,
        required: true
    },
    /**
     * Email người dùng
     */
    email: {
        type: String,
        required: true,
        unique: true
    },
    /**
     * Số điện thoại
     */
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    /**
     * Mật khẩu
     */
    password: {
        type: String,
        required: true
    },
    /**
     * Quyền của người dùng
     * Mặc định là user
     */
    role: {
        type: String,
        default: "User"
    },
    /**
     * Chứa đựng thông tin của các sản phẩm đã mua
     */
    cart: {
        type: Array,
        default: []
    },
    /**
     * Địa chỉ
     */
    address: [
        { type: mongoose.Types.ObjectId, ref: "Address" }
    ],
    /**
     * Danh sách sản phẩm yêu thích nối với bảng Product
     */
    wishList: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    /**
     * Kiểm tra xem tk user có bị khoa
     * Mặc định là không
     */
    isBlocked: {
        type: Boolean,
        default: false
    },
    /**
     * Lưu trữ refreshToken
     */
    refreshToken: {
        type: String
    },
    /**
     * Thời gian thay đổi mật khẩu
     */
    passwordChangeAt: {
        type: String
    },
    /**
     * Token khi thay đổi mật khẩu
     */
    passwordResetToken: {
        type: String
    },
    /**
     * Thời gian hết hạn thay đổi mật khẩu
     */
    passwordRestExpires: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false
});

/**
 * Trước khi dữ liệu được lưu vào db thì t mã hóa mật khẩu
 */
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.createPasswordChangeToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordRestExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;

}
const User = mongoose.model("User", userSchema);
module.exports = User;