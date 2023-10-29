const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;