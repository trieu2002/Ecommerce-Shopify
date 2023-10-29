const { verifyToken, isAdmin } = require("../middleware/verify_token");
const { createOrder, updatedStatus } = require("../controller/Order");
const router = require("express").Router();
router.post("/", verifyToken, createOrder);
router.put("/:oid", [verifyToken, isAdmin], updatedStatus);
module.exports = router;