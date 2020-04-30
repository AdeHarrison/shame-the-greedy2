"use strict";

let extractErrorMessages = function (err) {
    let messages = [];

    if (err) {
        for (let propertyName in err.errors) {
            messages.push("ERROR: " + err.errors[propertyName].message);
        }
    }

    return messages;
};

function getUTCDate() {
    let now = new Date();
    let year = now.getUTCFullYear();
    let utcMonth = now.getUTCMonth() + 1;
    let month = lpad(utcMonth.toString(), "0", 2);
    let day = lpad(now.getUTCDate().toString(), "0", 2);

    return year + month + day;
}

function lpad(strIn, padString, length) {
    let strOut = strIn;

    while (strOut.length < length) {
        strOut = padString + strOut;
    }

    return strOut;
}

module.exports = {
    extractErrorMessages,
    getUTCDate
};
