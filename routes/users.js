const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const formUtils = require("../utils/form")
const User = require('../models/user');
const security = require('../utils/security');

// Register Form
router.get('/register', function (req, res) {
    res.render('register', {formData: formUtils.createRegisterFormData(req)});
});

// Register Proccess
router.post('/register', function (req, res) {
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

        req.getValidationResult().then(result => {

            var errors = result.useFirstErrorOnly().array();

            if (errors.length > 0) {
                res.render('register', {
                    formData: formUtils.createRegisterFormData(req),
                    errors: errors
                });
            } else {
                security.generateSalt(10).then(salt => {

                    security.hashPassword(req.body.password, salt).then(hash => {

                        let user = new User({
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: hash,
                            passwordSalt: salt
                        });

                        user.save(function (err) {
                            if (err) {
                                errors.push(processSaveError(err));

                                res.render('register', {
                                    formData: formUtils.createRegisterFormData(req),
                                    errors: errors
                                });
                            } else {
                                req.flash('success', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            }
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                });
            }
        });
    } catch
        (err) {
        console.error(err);
        throw err;
    }
})

// Login Form
router.get('/login', function (req, res) {
    res.render('login', {formData: formUtils.createLoginFormData(req)});
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

function processSaveError(err) {
    if (err.message.includes("email_1 dup key")) {
        return {param: "email", msg: "Email address already registered"};
    }

    if (err.message.includes("username_1 dup key")) {
        return {param: "username", msg: "User Name already registered"};
    }
}

module.exports = router;
