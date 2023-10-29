const { verifyToken, isAdmin } = require("../middleware/verify_token");
const router = require("express").Router();
const { createNewCoupon, getAllCoupon, updatedCoupon, deletedCoupon } = require("../controller/Coupon");
router.get("/", getAllCoupon);
router.post("/", [verifyToken, isAdmin], createNewCoupon);
router.put("/:cid", [verifyToken, isAdmin], updatedCoupon);
router.delete("/:cid", [verifyToken, isAdmin], deletedCoupon);
module.exports = router;