'use strict'

var config = null;

if (process.env.NODE_ENV === 'production') {
    config = require("./config.prod.js");
}
else {
    config = require("./config.devel.js");
}

module.exports = config;