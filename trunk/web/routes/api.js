/**
 * Created by shafqat on 6/28/14.
 */

var express = require('express');
var router = express.Router();
var config = require ("./../config.active.js");

var prefix = config.apiprefix;

router.get (  "/project", function (req, res){
    var db = req.db;
    var collection = db.get('project');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});




module.exports = router;