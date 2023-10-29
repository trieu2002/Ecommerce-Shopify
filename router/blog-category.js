const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createBlogCategory, getAllBlogCategory, updatedBlogCategory, deletedBlogCategory } = require("../controller/BlogCategory");
const router = require("express").Router();
router.get("/", getAllBlogCategory);
router.post("/", [verifyToken, isAdmin], createBlogCategory);
router.put("/:pcid", [verifyToken, isAdmin], updatedBlogCategory);
router.delete("/:pcid", [verifyToken, isAdmin], deletedBlogCategory);

module.exports = router;