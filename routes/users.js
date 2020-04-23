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

            if (errors.length >0 ) {
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
                                console.log(err);
                                return;
                            } else {
                                req.flash('success', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            }
                        });
                    });
                });
            }
        });
        // const errors = req.validationErrors();
        // if (errors.length ==0) {
        //     return next();
        // }
        // const extractedErrors = []
        // errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
        //
        // return res.status(422).json({
        //     errors: extractedErrors,
        // });
        // // let errors = req.validationErrors().useFirstErrorOnly().array();
        //
        // if (errors) {
        //     res.render('register', {
        //         errors: errors
        //     });
        // }
    } catch (err) {
        console.error(err);
        throw err;
    }
    //
    //
    // const name = req.body.name;
    // const email = req.body.email;
    // const username = req.body.username;
    // const password = req.body.password;
    // const password2 = req.body.password2;
    //
    // req.checkBody('name', 'Name is required').notEmpty();
    // req.checkBody('email', 'Email is required').notEmpty();
    // req.checkBody('email', 'Email is not valid').isEmail();
    // req.checkBody('username', 'Username is required').notEmpty();
    // req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    //
    // let errors = req.validationErrors();
    //
    // if (errors) {
    //     res.render('register', {
    //         errors: errors
    //     });
    // } else {
    //     let newUser = new User({
    //         name: name,
    //         email: email,
    //         username: username,
    //         password: password
    //     });
    //
    //     bcrypt.genSalt(10, function (err, salt) {
    //         bcrypt.hash(newUser.password, salt, function (err, hash) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             newUser.password = hash;
    //             newUser.save(function (err) {
    //                 if (err) {
    //                     console.log(err);
    //                     return;
    //                 } else {
    //                     req.flash('success', 'You are now registered and can log in');
    //                     res.redirect('/users/login');
    //                 }
    //             });
    //         });
    //     });
    // }
})
;

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
