const express = require('express');
const router = express.Router();

const index_controller = require("../controllers/indexController");

router.get("/", index_controller.home_get);
router.get("/order", index_controller.order_get);

module.exports = router;
