const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/user');
const VoteCount = require('../models/voteCount');
const security = require('../utils/security');
const notification_controller = require("../controllers/notificationController");

// Register Form
router.get('/register', function (req, res) {
    res.render('register', {formData: formUtils.createRegisterFormData(req)});
});

// Register New User Process
router.post('/register', function (req, res) {
    _registerUser(req, res);
})

router.get('/authenticated', function (req, res) {
    res.send(req.isAuthenticated());
});

// Login Form
router.get('/login', function (req, res) {
    res.render('login', {formData: formUtils.createLoginFormData(req)});
});

// Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/stats',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/stats', function (req, res) {
    _getUserVotingStats(req.user._id, gConfig.todaysUTCDate).then(votingStats => {
        let sess = req.session;

        sess.votesToday = votingStats.votesToday;
        sess.votesRemaining = votingStats.votesRemaining;

        res.redirect("/");
    });
});

// logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

const _registerUser = async (req, res) => {
    try {
        req.checkBody('name', 'User Name must be 4-20 characters long')
            .len({min: 4, max: 20})

        req.checkBody('email', "Email address must be valid and 5-30 characters long")
            .isEmail()
            .len({min: 5, max: 30});

        req.checkBody('username', 'User Name must be 1-20 alphanumeric characters long')
            .len({min: 1, max: 20})
            .isAlphanumeric();

        req.checkBody('password', 'Password must be 8-10 alphanumeric characters long')
            .len({min: 8, max: 10})
            .isAlphanumeric();

        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        let result = await req.getValidationResult();

        let errors = result.useFirstErrorOnly().array();

        if (errors.length > 0) {
            res.render('register', {
                formData: formUtils.createRegisterFormData(req),
                errors: errors
            });
        } else {
            let salt = await security.generateSalt(10);
            let hash = await security.hashPassword(req.body.password, salt);
            let verificationID = generateRandomString(50);
            let verificationExpiryDate = new Date();

            verificationExpiryDate.setSeconds(verificationExpiryDate.getSeconds() + gConfig.verification_timeout);

            let user = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: hash,
                passwordSalt: salt,
                verified: false,
                verificationID: verificationID,
                verificationExpiryDate: verificationExpiryDate
            });

            await user.save();
            await notification_controller.sendVerificationEmail(req, verificationID);

            req.flash('success', 'Verification Email has been sent to the registered address');
            res.redirect('/users/login');
        }
    } catch (err) {
        errors.push(processSaveError(err));

        if (errors.length > 0) {
            res.render('register', {
                formData: formUtils.createRegisterFormData(req),
                errors: errors
            });
        } else {
            console.error(err);
        }
    }
};

function processSaveError(err) {
    if (err.message.includes("email_1 dup key")) {
        return {param: "email", msg: "Email address already registered"};
    }

    if (err.message.includes("username_1 dup key")) {
        return {param: "username", msg: "User Name already registered"};
    }
}

function generateRandomString(string_length) {
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for (let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

const _getUserVotingStats = async (userId, voteDay) => {
    try {
        return await getUserVotingStats(userId, voteDay);
    } catch (err) {
        console.error(err);
    }
}

const getUserVotingStats = async (userId, voteDay) => {
    let searchParams = {userId: userId, voteDay: voteDay};

    let voteCount = await VoteCount.findOne(searchParams);

    if (!voteCount) {
        voteCount = await VoteCount.create(searchParams);
    }

    let votingStats = {
        votesToday: voteCount.voteDayCount.toString(),
        votesRemaining: (gConfig.maxVotesPerDay - voteCount.voteDayCount).toString()
    };

    return votingStats;
};

module.exports = router;
