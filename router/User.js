const { register, login, getProfile, refreshToken, logout, forgotPassword, resetPassword, getUser, deleteUser, updateUserByAdmin, updateUser } = require("../controller/User");
const { verifyToken, isAdmin } = require("../middleware/verify_token");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/refresh", refreshToken);
router.get("/logout", verifyToken, logout);
router.get("/forgot", forgotPassword);
router.put("/reset-password", resetPassword);


router.get("/", [verifyToken, isAdmin], getUser);
router.delete("/:id", [verifyToken, isAdmin], deleteUser);
router.put("/profile", [verifyToken], updateUser);
router.put("/:id", [verifyToken, isAdmin], updateUserByAdmin);


module.exports = router;