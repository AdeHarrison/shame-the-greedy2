const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/user');
const security = require('../utils/security');
const Leech = require("../models/leech");
const multer = require("multer");
const sharp = require("sharp");

const uploadDirectory = multer({dest: "public/images/uploads"});

const SERVER_UPLOAD_DIRECTORY = "public/images/uploads/";
const CLIENT_UPLOAD_DIRECTORY = "/images/uploads/";

// Upload Form
router.get('/upload', function (req, res) {
    res.render('upload', {title: "Upload New Leech", formData: formUtils.createUploadFormData(req)});
});

// Upload Proccess
router.post('/upload', uploadDirectory.single("shopPhoto"), function (req, res) {
    const name = req.body.cityTown;
    try {
        req.checkBody('shopName', 'Shop Name must be 2-50 characters long')
            .len({min: 2, max: 50});

        req.checkBody('cityTown', "City/Town must be 1-50 characters long")
            .len({min: 1, max: 50});

        req.checkBody('districtArea', "District/Area must be 1-50 characters long")
            .len({min: 1, max: 50});

        req.checkBody('comments', "Comments can be upto 200 characters long")
            .len({max: 200});

        // let errors = [];
        //
        // if (!req.body.useStockPhoto && !req.file) {
        //     res.render('register', {
        //         formData: formUtils.createRegisterFormData(req),
        //         errors: errors.push({param: "useStockPhoto", msg: "You must select a stock photo or upload one"})
        //     });
        // }
        //
        // let isStockPhoto = req.body.useStockPhoto;
        // let photoLocation;
        //
        // // Stock photo takes precedence
        // if (isStockPhoto) {
        //     let randomPhotoNo = getRandomInteger(20, 1);
        //     photoLocation = "/images/stock/greedy" + randomPhotoNo + ".jpeg";
        // } else {
        //     photoLocation = "/images/uploads/" + req.file.filename;
        // }

        // TODO LIMIT FIZE SIZE

        req.getValidationResult().then(result => {

            var errors = result.useFirstErrorOnly().array();

            if (!req.body.useStockPhoto && !req.file) {
                errors.push({param: "useStockPhoto", msg: "You must select a stock photo or upload one"});
            }

            if (errors.length > 0) {
                res.render('upload', {
                    formData: formUtils.createUploadFormData(req),
                    errors: errors
                });
            } else {

                let leech = new Leech({
                    userId: req.user._id,
                    shopName: req.body.shopName,
                    cityTown: req.body.cityTown,
                    districtArea: req.body.districtArea,
                    comments: req.body.comments
                });

                let photoLocation;

                // Stock photo takes precedence
                if (req.body.useStockPhoto) {
                    let randomPhotoNo = getRandomInteger(20, 1);
                    photoLocation = "/images/stock/greedy" + randomPhotoNo + ".jpeg";
                        resizeImage(photoLocation).then(newPhotoLocation => {
                            leech.photoLocation = newPhotoLocation;
                        });
                } else {
                    leech.photoLocation = "/images/uploads/" + req.file.filename;
                }

                // if (!isStockPhoto) {
                //     await resizeImage(photoLocation).then(newPhotoLocation => {
                //         leech.photoLocation = newPhotoLocation;
                //     });
                // }

                leech.save(function (err) {
                    if (err) {
                        console.log(err);
                        // errors.push(processSaveError(err));
                        //
                        // res.render('register', {
                        //     formData: formUtils.createRegisterFormData(req),
                        //     errors: errors
                        // });
                    } else {
                        req.flash('success', 'Upload Successful');
                        res.redirect('/');
                    }
                });
            }
        });
    } catch
        (err) {
        console.error(err);
        throw err;
    }
})

const resizeImage = async (filePath) => {
    let oldFileName = path.basename(filePath);
    let newFileName = security.generateRandomHex(16) + ".jpeg";
    let oldServerFileName = SERVER_UPLOAD_DIRECTORY + oldFileName;
    let newServerFileName = SERVER_UPLOAD_DIRECTORY + newFileName;

    await sharp(oldServerFileName)
        .resize(200, 200)
        .toFormat("jpeg")
        .toFile(newServerFileName);

    return CLIENT_UPLOAD_DIRECTORY + newFileName;
};

// function processSaveError(err) {
//     if (err.message.includes("email_1 dup key")) {
//         return {param: "email", msg: "Email address already registered"};
//     }
//
//     if (err.message.includes("username_1 dup key")) {
//         return {param: "username", msg: "User Name already registered"};
//     }
// }
//
// // Login Form
// router.get('/login', function (req, res) {
//     res.render('login', {title: "Login", formData: formUtils.createLoginFormData(req)});
// });
//
// // Login Process
// router.post('/login', function (req, res, next) {
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/users/login',
//         failureFlash: true
//     })(req, res, next);
// });
//
// logout

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

function getRandomInteger(maxInt, minInt) {
    return Math.floor(Math.random() * (maxInt - minInt)) + 1;
}

module.exports = router;
