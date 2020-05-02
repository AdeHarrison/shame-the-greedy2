"use strict";

const mongoose = require("mongoose");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const formUtils = require("../utils/form")
const security = require('../utils/security');
const VoteCount = require("../models/leeches/voteCount");
const Leech = require("../models/leeches/leech");
const Vote = require("../models/leeches/vote");

const SERVER_UPLOAD_DIRECTORY = "public/images/uploads/";
const CLIENT_UPLOAD_DIRECTORY = "/images/uploads/";

exports.leech_upload_get = (req, res) => {
    res.render('leeches/upload', {formData: formUtils.createUploadFormData(req)});
};

exports.leech_upload_post = (req, res) => {
    try {
        req.checkBody('shopName', 'Shop Name must be 2-30 characters long')
            .len({min: 2, max: 30});

        req.checkBody('cityTown', "City/Town must be 1-30 characters long")
            .len({min: 1, max: 30});

        req.checkBody('districtArea', "District/Area must be 1-30 characters long")
            .len({min: 1, max: 30});

        req.checkBody('comments', "Comments can be upto 100 characters long")
            .len({max: 100})

        req.getValidationResult().then(result => {

                let errors = result.useFirstErrorOnly().array();

                if (!req.body.useStockPhoto && !req.file) {
                    errors.push({param: "useStockPhoto", msg: "You must select a stock photo or upload one"});
                }

                if (errors.length > 0) {
                    res.render('leeches/upload', {
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
                                res.cookie("filterMyLeeches-" + req.user._id, true)
                                    .redirect('/');
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
                                    fs.unlink(path.join("./public", uploadedPhotoLocation), err => {
                                        if (err) {
                                            throw err;
                                        }

                                        req.flash('success', 'Upload Successful');
                                        res.cookie("filterMyLeeches-" + req.user._id, true)
                                            .redirect('/');
                                    });
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
};

exports.leech_vote_get = (req, res) => {
    _leech_vote_get(req.user._id, gConfig.todaysUTCDate, req.query.id).then(votingStats => {
        return res.send(votingStats);
    });
};

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

        return {
            leechVotes: leech.voteCount.toString(),
            votesToday: voteCount.voteDayCount.toString(),
            votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
        };
    } catch (err) {
        console.error(err);
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
            .toFile(newServerFileName, (err) => {
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

