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
const path = require("path");

const uploadDirectory = multer({dest: "public/images/uploads"});

const SERVER_UPLOAD_DIRECTORY = "public/images/uploads/";
const CLIENT_UPLOAD_DIRECTORY = "/images/uploads/";

// Upload Form
router.get('/upload', function (req, res) {
    res.render('upload', {formData: formUtils.createUploadFormData(req)});
});

// Upload Process
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

                    // Stock photo takes precedence
                    if (req.body.useStockPhoto) {
                        leech.photoLocation = "/images/stock/greedy" + getRandomInteger(20, 1) + ".jpeg";
                        leech.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'Upload Successful');
                                res.redirect('/');
                            }
                        });
                    } else {
                        let uploadedPhotoLocation = "/images/uploads/" + req.file.filename;
                        resizeImage(uploadedPhotoLocation).then(newPhotoLocation => {
                            leech.photoLocation = newPhotoLocation;
                            leech.save(function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.flash('success', 'Upload Successful');
                                    res.redirect('/');
                                }
                            });

                        });
                    }
                }
            }
        );
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

    return new Promise((resolve, reject) => {
        sharp(oldServerFileName)
            .resize(200, 200)
            .toFormat("jpeg")
            .toFile(newServerFileName, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(CLIENT_UPLOAD_DIRECTORY + newFileName);
                }
            });
    });
};

function getRandomInteger(maxInt, minInt) {
    return Math.floor(Math.random() * (maxInt - minInt)) + 1;
}

module.exports = router;
