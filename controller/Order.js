const Order = require("../model/Order");
const asyncHandler = require("express-async-handler");
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
    if (coupon) total = Math.round(total * (1 - coupon) / 100);
    const rs = await Order.create({ products, total, orderBy: _id });
    return res.status(200).json({
        success: rs ? true : false,
        data: rs ? rs : "Thất bại"
    })
});
module.exports = {
    createOrder
}