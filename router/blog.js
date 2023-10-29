const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createBlog, getAllBlog, updatedBlog, deletedBlog, likeBlog, getOneBlog, uploadImageProduct } = require("../controller/Blog");
const uploader = require("../config/cloudinary.config");
const router = require("express").Router();
router.get("/", getAllBlog);
router.get("/:bid", getOneBlog);
router.put("/like", [verifyToken], likeBlog)
router.post("/", [verifyToken, isAdmin], createBlog);
router.put("/:bid", [verifyToken, isAdmin], updatedBlog);
router.put("/uploadimage/:id", [verifyToken, isAdmin], uploader.single("image"), uploadImageProduct);
router.delete("/:bid", [verifyToken, isAdmin], deletedBlog);

module.exports = router;