"use strict";

const crypto = require("crypto");

let generateSalt = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

let extractErrorMessages = function (err) {
    let messages = [];

    if (err) {
        for (let propertyName in err.errors) {
            messages.push("ERROR: " + err.errors[propertyName].message);
        }
    }

    return messages;
};

let sha512 = function (text, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(text);
    let value = hash.digest('hex');

    return {
        salt: salt,
        passwordHash: value
    };
};

function encryptText(text, salt) {
    return sha512(text, salt);
}

function generateRandomHex(len) {
    return crypto.randomBytes(len).toString('hex');
}

module.exports = {
    generateSalt,
    encryptText,
    generateRandomHex
};
