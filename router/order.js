const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createOrder, updatedStatus, getOrderByUser, getOrderByAdmin } = require("../controller/Order");
const router = require("express").Router();
router.get("/user", [verifyToken], getOrderByUser);
router.get("/admin", [verifyToken, isAdmin], getOrderByAdmin);
router.post("/", verifyToken, createOrder);
router.put("/:oid", [verifyToken, isAdmin], updatedStatus);

module.exports = router;