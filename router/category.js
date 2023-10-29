const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createProductCategory, getAllProductCategory, updatedProductCategory, deletedProductCategory } = require("../controller/ProductCategory");
const router = require("express").Router();
router.get("/", getAllProductCategory);
router.post("/", [verifyToken, isAdmin], createProductCategory);
router.put("/:pcid", [verifyToken, isAdmin], updatedProductCategory);
router.delete("/:pcid", [verifyToken, isAdmin], deletedProductCategory);

module.exports = router;