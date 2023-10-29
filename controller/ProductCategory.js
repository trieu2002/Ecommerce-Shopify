const ProductCategory = require("../model/ProductCategory");
const asyncHandler = require("express-async-handler");
const createProductCategory = asyncHandler(async (req, res) => {
    console.log('<<<<<<< req.body >>>>>>>', req.body);
    const { title } = req.body;
    if (!title) throw new Error("Missing input");
    console.log('<<<<<<< title >>>>>>>', typeof title);

    // Tạo một đối tượng chứa thông tin danh mục sản phẩm
    const categoryData = {
        title // hoặc title nếu bạn đã có dữ liệu từ req.body
        // Thêm các trường dữ liệu khác cần thiết
    };

    const response = await ProductCategory.create(categoryData);
    console.log('<<<<<<< response >>>>>>>', response);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Tạo thất bại"
    });
});

const getAllProductCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find();
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Lấy dữ liệu thất bại"
    })
});
const updatedProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cập nhật thất bại"
    })
})
const deletedProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Xóa thất bại"
    })
})
module.exports = {
    createProductCategory,
    getAllProductCategory,
    updatedProductCategory,
    deletedProductCategory
}