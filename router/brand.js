const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { getAllBrand, updatedBrand, deletedBrand, createBrand } = require("../controller/Brand");
const router = require("express").Router();
router.get("/", getAllBrand);
router.post("/", [verifyToken, isAdmin], createBrand);
router.put("/:bid", [verifyToken, isAdmin], updatedBrand);
router.delete("/:bid", [verifyToken, isAdmin], deletedBrand);
module.exports = router;