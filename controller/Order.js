const Order = require("../model/Order");
const asyncHandler = require("express-async-handler");
const Coupon = require("../model/Coupon");
const User = require("../model/User");
const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const userCart = await User.findById(_id).select("cart").populate("cart.products", "title price");
    console.log('<<<<<<< userCart >>>>>>>', userCart);
    const products = userCart?.cart?.map(el => ({
        product: el.products._id,
        count: el.quantity,
        color: el.color
    }));
    let total = userCart?.cart?.reduce((sum, el) => el.products.price * el.quantity + sum, 0);
    let createdData = { products, total, orderBy: _id };
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);

        total = Math.round(total * (1 - +selectedCoupon.discount / 100) / 100) * 1000 || total;
        createdData.total = total;
        createdData.coupon = coupon;
    }
    const rs = await Order.create(createdData);
    return res.status(200).json({
        success: rs ? true : false,
        data: rs ? rs : "Thất bại"
    })
});
const updatedStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error("Missing input");
    const rs = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    return res.status(200).json({
        success: rs ? true : false,
        data: rs ? rs : "Thất bại"
    })
});
const getOrderByUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const rs = await Order.findById({ orderBy: _id });
    return res.status(200).json({
        success: rs ? true : false,
        data: rs ? rs : "Thất bại"
    })
});
const getOrderByAdmin = asyncHandler(async (req, res) => {
    const rs = await Order.find();
    return res.status(200).json({
        success: rs ? true : false,
        data: rs ? rs : "Thất bại"
    })
})

module.exports = {
    createOrder,
    updatedStatus,
    getOrderByUser,
    getOrderByAdmin
}