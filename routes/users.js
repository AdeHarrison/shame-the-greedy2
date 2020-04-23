const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/user');

// Register Form
router.get('/register', function (req, res) {
    res.render('register', {title: "Register New User", formData: formUtils.createRegisterFormData(req)});
});

// Register Proccess
router.post('/register', function (req, res) {
    try {
        req.checkBody('name', 'User Name must be 4-20 alphanumeric characters long')
            .len({min: 4, max: 20})
            .isAlphanumeric();

        req.checkBody('email', "Email address must be valid and between 5-50 alphanumeric characters long")
            .isEmail()
            .len({min: 5, max: 50});

        req.checkBody('userName', 'User Name must be 1-20 alphanumeric characters long')
            .len({min: 1, max: 20})
            .isAlphanumeric();

        req.checkBody('password', 'Password must be between 8 and 20 alphanumeric characters')
            .len({min: 8, max: 20})
            .isAlphanumeric();

        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        req.getValidationResult().then(result => {

            var errors = result.useFirstErrorOnly().array();

            if (errors.length > 0) {
                res.render('register', {
                    formData: formUtils.createRegisterFormData(req),
                    errors: errors
                });
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }

                        let user = new User({
                            name: req.body.name,
                            email: req.body.email,
                            userName: req.body.userName,
                            password: hash
                        });

                        user.save(function (err) {
                            if (err) {
                                errors.push(processSaveError(err));

                                res.render('register', {
                                    formData: formUtils.createRegisterFormData(req),
                                    errors: errors
                                });
                                // console.log(err);
                                // return;
                            } else {
                                req.flash('success', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            }
                        });
                    });
                });
            }
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
});

function processSaveError(err) {
    if (err.message.includes("email_1 dup key")) {
        return {param: "email", msg: "Email address already registered"};
    }

    if (err.message.includes("userName_1 dup key")) {
        return {param: "userName", msg: "User Name already registered"};
    }
}

// Login Form
router.get('/login', function (req, res) {
    res.render('login');
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
