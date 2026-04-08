const router = require("express").Router();
const userController = require("../controllers/UserController");
const validatetoken = require("../middleware/AuthMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


router.get("/", validatetoken, userController.getAllUsers);

router.get("/profile", validatetoken, userController.getUserProfile);

router.put("/:id", validatetoken, userController.updateUser);

router.delete("/:id", validatetoken, userController.deleteUser);

module.exports = router;