const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/users/user');
const security = require('../utils/security');
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const VoteCount = require("../models/leeches/voteCount");
const Leech = require("../models/leeches/leech");
const Vote = require("../models/leeches/vote");

const uploadDirectory = multer({dest: "public/images/uploads"});

const SERVER_UPLOAD_DIRECTORY = "public/images/uploads/";
const CLIENT_UPLOAD_DIRECTORY = "/images/uploads/";

router.get("/*", function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
});

// Upload Form
router.get('/upload', function (req, res) {
    res.render('leeches/upload', {formData: formUtils.createUploadFormData(req)});
});

// Upload Process
router.post('/upload', uploadDirectory.single("shopPhoto"), function (req, res) {
    try {
        req.checkBody('shopName', 'Shop Name must be 2-30 characters long')
            .len({min: 2, max: 30});

        req.checkBody('cityTown', "City/Town must be 1-30 characters long")
            .len({min: 1, max: 30});

        req.checkBody('districtArea', "District/Area must be 1-30 characters long")
            .len({min: 1, max: 30});

        req.checkBody('comments', "Comments can be upto 100 characters long")
            .len({max: 100})

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

router.get('/vote', (req, res) => {
    _leech_vote_get(req.user._id, gConfig.todaysUTCDate, req.query.id).then(votingStats => {
        return res.send(votingStats);
    });
});

const _leech_vote_get = async (userId, voteDay, leechId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let searchParams = {userId: userId, voteDay: voteDay};

        let voteCount = await VoteCount.findOneAndUpdate(searchParams, {$inc: {voteDayCount: 1}}, {
            new: true,
            upsert: true
        }).session(session);

        let leech = await Leech.findOneAndUpdate({_id: leechId}, {$inc: {voteCount: 1}}, {
            new: true,
            upsert: true
        }).session(session);

        let vote = new Vote({
            userId: userId,
            leechId: leech._id,
            voteDate: new Date().toUTCString()
        });

        await vote.save();

        await session.commitTransaction();

        let votingStats = {
            leechVotes: leech.voteCount.toString(),
            votesToday: voteCount.voteDayCount.toString(),
            votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
        };

        return votingStats;
    } catch (err) {
        await session.abortTransaction();

        console.error(err);
        throw err;
    } finally {
        session.endSession();
    }
}


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
