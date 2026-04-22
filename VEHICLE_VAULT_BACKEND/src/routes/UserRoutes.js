const router = require("express").Router();
const userController = require("../controllers/UserController");
const validatetoken = require("../middleware/AuthMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);
router.post("/google-login", userController.googleLogin);
router.post("/google-signup", userController.googleSignup); // New Route

router.post("/reset-password/:token", userController.resetPassword);

router.get("/", validatetoken, userController.getAllUsers);
router.get("/profile", validatetoken, userController.getUserProfile);
router.put("/:id", validatetoken, userController.updateUser);
router.delete("/:id", validatetoken, userController.deleteUser);

module.exports = router;