const Blog = require("../model/Blog");
const asyncHandler = require("express-async-handler");
const createBlog = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing input");
    const response = await Blog.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Không thể tạo"
    })
});
const updatedBlog = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing input");
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Cập nhật thất bại"
    })
});
const getAllBlog = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Lấy dữ liệu thất bại"
    })
});
const deletedBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Xóa thất bại"
    })
});
const excudedFields = "-refreshToken -password -role";
const getOneBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true }).populate("likes", excudedFields);
    return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Xóa thất bại"
    })
})
// làm nut like và dislike
/**
 * Khi người dùng like 1 bài blog thì
 * 1. Check xem người đó trước đó có dislike hay không => bỏ dislike
 * 2. Check xem người đó trước đó có like hay không => bỏ like/thêm like
 */
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.body;
    if (!bid) throw new Error("Missing input");
    // tìm xem bài viết đó
    const blog = await Blog.findById(bid);
    // kiểm tra xem đó đc ddisslike hay chưa
    const alreadyLikes = blog?.dislikes.some(el => el._id.toString() === _id);
    if (alreadyLikes) {
        // đã dislike
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id }, isDisliked: false }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    };
    // kiểm tra xem đa like chưa
    const isLiked = blog?.isLiked;
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLiked: false }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id }, isLiked: true }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    }

});
const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.body;
    if (!bid) throw new Error("Missing input");
    // tìm xem bài viết đó
    const blog = await Blog.findById(bid);
    // kiểm tra xem đó đc ddisslike hay chưa
    const alreadyDislikes = blog?.likes.some(el => el._id.toString() === _id);
    if (alreadyDislikes) {
        // đã dislike
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLiked: false }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    };
    // kiểm tra xem đa like chưa
    const isDisliked = blog?.isDisliked;
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isDisliked: false }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id }, isDisliked: true }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            rs: response
        })
    }

})
module.exports = {
    createBlog,
    updatedBlog,
    getAllBlog,
    deletedBlog,
    likeBlog,
    dislikeBlog,
    getOneBlog
}