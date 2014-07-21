'use strict'
/**
 * Created by shafqat on 6/26/14.
 */

module.exports = exports;

exports.name = "production";
exports.port = 3001;
exports.db = "kanbantfs";
exports.dbhost = "127.0.0.1";
exports.dbport = "27017";
exports.getConnUri =  function () {return "mongodb://"+ exports.dbhost + ":" + exports.dbport+ "/" + exports.db;}
exports.apiprefix = "/api"