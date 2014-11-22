'use strict'

var config = require ("./../config.active.js");

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.getConnUri());


module.exports = db;

