const Product = require("../model/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing input");
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        data: newProduct ? newProduct : 'Tạo thất bại'
    })
});
const getProductDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new Error("Missing input");
    const product = await Product.findById(id);
    return res.status(200).json({
        success: product ? true : false,
        data: product ? product : 'Lấy thất bại'
    })
});
/**
 * Link tham khảo làm
 * https://jeffdevslife.com/p/2-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
 */
// filtering,sort,pagination
const getAllProduct = asyncHandler(async (req, res) => {
    // copy tất các các query sang 1 ô nhớ khác
    const queries = { ...req.query };
    // tạo ra cac trường đặc biệt thành 1 mảng
    /**
     * page và limit đại diện cho phân trang
     * sort đại điện cho sắp xếp
     * fielđ đại diện cho các thuộc tính nào muốn trả về
     */
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // tách các trường đặc biệt ra khỏi query đã copy
    excludedFields.forEach(el => delete queries[el]);
    // thêm kí tự $ vào các giá trị  đặc biệt
    // vì client gửi lên sẽ không có $
    // format lại đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // convert về dạng object {}
    const formatQueries = JSON.parse(queryString);
    console.log('<<<<<<< formatQueries >>>>>>>', formatQueries);

    // viết cho filtering
    if (queries?.title) formatQueries.title = { '$regex': queries?.title, '$options': 'i' };
    let query = Product.find(formatQueries);
    // sorting
    // kiểu dnagh abc,efh => [abc,efh]=> abc efh
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log('<<<<<<< sortBy >>>>>>>', sortBy);
        query = query.sort(sortBy);
    };
    // giới hạn các thuộc tính trả về
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }
    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);



    // thực thi query
    const counts = await Product.countDocuments(formatQueries);
    const products = await query;
    console.log('<<<<<<< products >>>>>>>', products);

    return res.status(200).json({
        success: products ? true : false,
        data: products ? products : 'Lấy thất bại',
        counts
    })
});
// update sản phẩm
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const product = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: product ? true : false,
        data: product ? product : 'Cập nhật thất bại'
    });
});
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    const product = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: product ? true : false,
        data: product ? product : 'Xóa thất bại',

    });
});
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) throw new Error("Missing input");
    // có hai trường hợp
    /**
     * TH1: sản phẩm đó có người đánh giá rồi
     */
    // tìm ra sản phẩm đánh giá
    const ratingProduct = await Product.findById(pid);
    // kiêm tra xem sản phẩm đó đã được đánh giá hay chưa
    const alreadyRatings = ratingProduct?.ratings.some(el => el.postedBy.toString() === _id);
    console.log('<<<<<<< alreadyRatings >>>>>>>', alreadyRatings);
    if (alreadyRatings) {
        // tìm thấy thì cập nhật
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRatings }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true });
    } else {
        // không tìm thấy thì thêm ratings cho sản phẩm
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true });

    }
    const updatedProduct = await Product.find(pid);
    const ratingCount = updateProduct?.ratings.length;
    const sumRating = updateProduct?.ratings.reduce((sum, el) => sum + +el.star, 0);
    updatedProduct.totalRatings = Math.round(sumRating * 10 / ratingCount) / 10;
    await updateProduct.save();
    return res.status(200).json({
        success: response ? true : false,
        data: updatedProduct ? updatedProduct : 'Cập nhật thất bại',

    });

});
const uploadImageProduct = asyncHandler(async (req, res) => {
    // link tham khảo pus multiple object to mongooose
    // link https://stackoverflow.com/questions/58277545/how-to-push-multiple-objects-in-array-using-push-mongoose

    const { id } = req.params;
    if (!req.files) throw new Error("Missing input");
    const response = await Product.findByIdAndUpdate(id, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : 'Không thể upload ảnh',

    });
});
module.exports = {
    createProduct,
    getProductDetail,
    getAllProduct,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProduct
}