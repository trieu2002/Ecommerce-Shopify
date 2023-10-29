const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createOrder } = require("../controller/Order");
const router = require("express").Router();
router.post("/", verifyToken, createOrder);
module.exports = router;