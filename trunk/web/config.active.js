'use strict'

var config = null;

if (process.env.NODE_ENV === 'production') {
    config = require("./config.prod.js");
}
if (process.env.NODE_ENV === 'c9') {
    config = require("./config.c9.js");
}
else {
    config = require("./config.devel.js");
}

module.exports = config;