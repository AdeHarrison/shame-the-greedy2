"use strict";

const security = require("../utils/security");
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/users/user');

const notificationController = require("../controllers/notificationController");

exports.register_get = (req, res) => {
    res.render('users/register', {formData: formUtils.createRegisterFormData(req)});
};

exports.register_post = (req, res) => {
    return _registerUser(req, res);
};

exports.verify_get = (req, res) => {
    return _verify(req, res);
};

exports.login_get = (req, res) => {
    res.render('users/login', {formData: formUtils.createLoginFormData(req)});
};

exports.login_post = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout_get = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
};

exports.details_get = (req, res) => {
    if (req.user) {
        res.send({
            isAuthenticated: req.isAuthenticated(),
            filterMyLeechesCookieName: "filterMyLeeches-" + req.user._id
        });
    } else {
        res.send(false);
    }
};

const _registerUser = async (req, res) => {
    let errors = [];

    try {
        req.checkBody('username', 'User Name must be 1-20 alphanumeric characters long')
            .len({min: 1, max: 20})
            .isAlphanumeric();

        req.checkBody('email', "Email address must be valid and 5-30 characters long")
            .isEmail()
            .len({min: 5, max: 30});

        req.checkBody('password', 'Password must be 8-10 alphanumeric characters long')
            .len({min: 8, max: 10})
            .isAlphanumeric();

        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        let result = await req.getValidationResult();

        errors = result.useFirstErrorOnly().array();

        if (errors.length > 0) {
            res.render('users/register', {
                formData: formUtils.createRegisterFormData(req),
                errors: errors
            });
        } else {
            let email = req.body.email;
            let salt = await security.generateBcryptSalt(10);
            let hash = await security.hashPassword(req.body.password, salt);
            let verificationSalt = security.generateCryptoSalt(16);
            let verification = security.encryptText(email, verificationSalt).passwordHash;

            let verificationExpiryDate = new Date();
            verificationExpiryDate.setSeconds(verificationExpiryDate.getSeconds() + gConfig.verification_timeout);

            let user = new User({
                name: req.body.name,
                email: email,
                username: req.body.username,
                password: hash,
                passwordSalt: salt,
                verified: false,
                verificationSalt: verificationSalt,
                verification: verification,
                verificationExpiryDate: verificationExpiryDate
            });

            await user.save();
            await notificationController.sendVerificationEmail(req, email, verification);

            req.flash('success', 'Verification Email has been sent to the registered address');
            res.redirect('/users/login');
        }
    } catch (err) {
        errors.push(processSaveError(err));

        if (errors.length > 0) {
            res.render('users/register', {
                formData: formUtils.createRegisterFormData(req),
                errors: errors
            });
        } else {
            console.error(err);
        }
    }
};

const _verify = async (req, res) => {
    try {
        //todo somehow tie verification to email address

        let actualVerification = req.query.id;

        let user = await User.findOne({verification: actualVerification});

        if (user == null) {
            req.flash('danger', 'User account not found');
            return res.redirect('/');
        }

        if (user.verified) {
            req.flash('danger', 'User is already verified');
            return res.redirect('/');
        }

        // Verification window expired
        let now = new Date();
        if (now > user.verificationExpiryDate) {
            let verification_expiry_date = new Date();
            verification_expiry_date.setSeconds(verification_expiry_date.getSeconds() + gConfig.verification_timeout);
            user.verificationExpiryDate = verification_expiry_date;

            user.verificationSalt = security.generateCryptoSalt(16);
            user.verification = security.encryptText(user.email, user.verificationSalt).passwordHash;

            await user.save();
            await notificationController.sendVerificationEmail(req, user.email, user.verification);

            req.flash('danger', 'Verification window has expired, new Verification Email sent');
            return res.redirect('/');
        } else {
            let expectedVerification = security.encryptText(user.email, user.verificationSalt).passwordHash;

            if (actualVerification !== expectedVerification) {
                req.flash('danger', 'Verification email does not match registered account');
                return res.redirect('/');
            }

            user.verified = true;

            await user.save();

            req.flash('success', 'User Verified');
            return res.redirect('/users/login');
        }
    } catch (err) {
        console.error(err);
        throw err;
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
