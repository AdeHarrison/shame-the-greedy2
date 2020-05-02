"use strict";

const nodemailer = require("nodemailer");
const fs = require("fs");

let smtpTransport = nodemailer.createTransport(gConfig.mailConfig);

exports.sendVerificationEmail = (req, email, verification) => {
    let link = "http://" + req.get("host") + "/users/verify?id=" + verification;

    // todo bodge until read pop3 in cypress sorted
    if (process.env.NODE_ENV === 'testing') {
        fs.writeFile("utils/link.txt", link, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }

    let mailOptions = {
        to: email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email (may open in a new Tab).<br><a href=" + link + ">Click here to verify</a>"
    };

    return smtpTransport.sendMail(mailOptions);
};
