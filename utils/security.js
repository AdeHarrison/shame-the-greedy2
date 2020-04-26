"use strict";

const bcrypt = require('bcryptjs');
const crypto = require("crypto");

const generateBcryptSalt = async (saltRounds) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                reject(err);
            } else {
                resolve(salt);
            }
        });
    });
};

const hashPassword = async (password, salt) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

let generateCryptoSalt = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
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
    generateBcryptSalt,
    generateCryptoSalt,
    hashPassword,
    encryptText,
    generateRandomHex
};
