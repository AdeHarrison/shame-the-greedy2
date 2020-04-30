const express = require('express');
const router = express.Router();
const multer = require("multer");

const leech_controller = require("../controllers/leechController");

const uploadDirectory = multer({dest: "public/images/uploads"});

router.get("/*", function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
});

router.get("/upload", leech_controller.leech_upload_get);
router.post("/upload", uploadDirectory.single("shopPhoto"), leech_controller.leech_upload_post);

router.get("/vote", leech_controller.leech_vote_get);

module.exports = router;
