const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");

router.get("/register", user_controller.register_get);
router.post("/register", user_controller.register_post);

router.get("/verify", user_controller.verify_get);

router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);

router.get("/logout", user_controller.logout_get);

router.get("/details", user_controller.details_get);

module.exports = router;
