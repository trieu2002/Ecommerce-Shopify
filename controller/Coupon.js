const Coupon = require("../model/Coupon");
const asyncHandler = require("express-async-handler");
const createNewCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) throw new Error("Missing input");
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + expiry * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Tạo thất bại"
    })
});
const getAllCoupon = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select("-createdAt -updatedAt");
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Lấy thất bại"
    })
});
const updatedCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing input");
    if (req.body.expiry) req.body.expiry = Date.now() + 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cập nhật thất bại"
    })
});
const deletedCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;

    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Xóa thất bại"
    })
});
module.exports = {
    createNewCoupon,
    getAllCoupon,
    updatedCoupon,
    deletedCoupon

}