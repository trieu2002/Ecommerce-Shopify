const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: "Product" },
            count: Number,
            color: String
        }
    ],
    status: {
        type: String,
        default: "Processing",
        enum: ['Cancelled', "Processing", "Successed"]
    },
    paymentIntent: {

    },
    total: Number,
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: "Coupon"
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timeseries: true,
    versionKey: false
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;