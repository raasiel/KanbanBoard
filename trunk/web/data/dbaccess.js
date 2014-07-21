'use strict'

var config = require ("./../config.active.js");

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.getConnUri());

exports = db;
module.exports = exports;

