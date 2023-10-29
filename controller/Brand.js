const Brand = require("../model/Brand");
const asyncHandler = require("express-async-handler");
const createBrand = asyncHandler(async (req, res) => {
    console.log('<<<<<<< req.body >>>>>>>', req.body);
    const { title } = req.body;
    if (!title) throw new Error("Missing input");
    console.log('<<<<<<< title >>>>>>>', typeof title);

    // Tạo một đối tượng chứa thông tin danh mục sản phẩm
    const categoryData = {
        title // hoặc title nếu bạn đã có dữ liệu từ req.body
        // Thêm các trường dữ liệu khác cần thiết
    };

    const response = await Brand.create(categoryData);
    console.log('<<<<<<< response >>>>>>>', response);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Tạo thất bại"
    });
});

const getAllBrand = asyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Lấy dữ liệu thất bại"
    })
});
const updatedBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    console.log('<<<<<<< bid >>>>>>>', bid);
    const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cập nhật thất bại"
    })
})
const deletedBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Xóa thất bại"
    })
})
module.exports = {
    createBrand,
    getAllBrand,
    updatedBrand,
    deletedBrand
}