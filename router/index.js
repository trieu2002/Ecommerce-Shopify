const { notFound, errHandler } = require("../middleware/err_handler");
const userRoute = require("./User");
const productRoute = require("./product");
const productCategoryRoute = require("./category");
const blogCategoryRoute = require("./blog-category");
const blogRoute = require("./blog");
const brandRoute = require("./brand");
const couponRoute = require("./coupon");
const orderRoute = require("./order");
const initRoutes = (app) => {
    app.use("/api/v1/user", userRoute);
    app.use("/api/v2/product", productRoute);
    app.use("/api/v3/category", productCategoryRoute);
    app.use("/api/v3/blog-category", blogCategoryRoute);
    app.use("/api/v5/blog", blogRoute);
    app.use("/api/v4/brand", brandRoute);
    app.use("/api/v6/coupon", couponRoute);
    app.use("/api/v7/order", orderRoute);

    // định nghĩa xử lý lỗi tập  chung
    app.use(notFound);
    app.use(errHandler);
};
module.exports = initRoutes;