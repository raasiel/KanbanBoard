/**
 * Created by shafqat on 6/28/14.
 */

var express = require('express');
var router = express.Router();
var config = require ("./../config.active.js");

var prefix = config.apiprefix;
var objectid = require('mongodb').ObjectID;
var NEW_TASK_ID = 99999;


function jsonWrite(res, obj) {
    var body = JSON.stringify(obj);
    // content-type
    res.get('Content-Type') || res.set('Content-Type', 'application/json');
    res.write(body);
}

router.get (  "/project", function (req, res){
    var db = req.db;
    var collection = db.get('project');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get("/project/id/:project_id", function (req, res) {
    var db = req.db;
    var project_id = req.params.project_id;
    var collection = db.get('project');
    collection.findOne({"_id": project_id}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get("/project/name/:project_name", function (req, res) {
    var db = req.db;
    var project_name = req.params.project_name;
    var collection = db.get('project');
    collection.findOne({"name": project_name}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get("/user/", function (req, res) {
    var db = req.db;
    //var user_name = req.params.user_name;
    var collection = db.get('user');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get("/user/id/:user_id", function (req, res) {
    var db = req.db;
    var user_id = req.params.user_id;
    var collection = db.get('user');
    collection.findOne({"_id": user_id}, {}, function (e, docs) {
        res.json(docs);
    });
});


router.get("/user/name/:user_name", function (req, res) {
    var db = req.db;
    var user_name = req.params.user_name;
    var collection = db.get('user');
    collection.findOne({"name": user_name}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get("/project/:project_id/status", function (req, res) {
    var db = req.db;
    var project_id = req.params.project_id;
    var collection = db.get('projectstatus');
    collection.find({"project": objectid(project_id)}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get("/project/:project_id/user", function (req, res) {
    var db = req.db;
    var project_id = req.params.project_id;
    var colProj = db.get('project');
    var colUser = db.get('user');

    colProj.findOne({"_id": objectid(project_id)}, {}, function (e, proj) {
        var promise = colUser.find({"_id": {$in: proj.users}}, {"_id": 1, email: 1, name: 1});
        promise.on("complete", function (e, users) {
            // Keep writing to response. Dont end
            jsonWrite(res, users);
        });
        promise.on('success', function () {
            // When call has finished. Shut down
            res.end();
        });
    });

});

router.get("/task/project/:project_id", function (req, res) {
    var db = req.db;
    var project_id = req.params.project_id;
    var collection = db.get('task');
    collection.find({"project": objectid(project_id)}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.post("/task/update", function (req, res) {
    var db = req.db;
    var collection = db.get('task');

    /* Update */
    if (req.body._id != NEW_TASK_ID) {
        collection.findAndModify({_id: objectid(req.body._id)}, {$set: {
            user: objectid(req.body.user),
            status: objectid(req.body.status),
            title: req.body.title,
            description: req.body.description,
            project: objectid(req.body.project),
            tfsid: 0
        }}, {}, function () {
            res.json({message: "ok", id: objectid(req.body._id)});
        });
    } else {
        var task = {_id: new objectid(),
            user: objectid(req.body.user),
            status: objectid(req.body.status),
            title: req.body.title,
            description: req.body.description,
            project: objectid(req.body.project),
            tfsid: 0
        }
        collection.insert(task, {}, function () {
            res.json({message: "ok", id: objectid(task._id)});
        });

    }
});

router.get("/templates/:name", function (req, res) {
    var fs = require("fs");
    var path = require('path');
    tmpldir = path.dirname(path.dirname(require.main.filename) + "..") + "/public/templates/";
    filename = tmpldir + req.params.name + ".html";
    fs.readFile(filename, function (err, data) {
        if (err) throw err;
        var buf = new Buffer(data);
        res.json({content: buf.toString()});
    });
});

var tfsRoutes = {
    "queries": "https://cmra.wkglobal.com:8088/tfs/FS-RC/HMDAWiz-Agile/_api/_wit/queries?__v=3&includeQueryTexts=true",
    "projects": "https://cmra.wkglobal.com:8088/tfs/FS-RC/_api/_wit/teamProjects?__v=3"
}

router.get("/tfs/project/", function (req, res) {

    var url = "https://cmra.wkglobal.com:8088/tfs/FS-RC/_api/_wit/teamProjects?__v=3"
        , domain = "NA"
        , username = "shafqat.ahmed"
        , password = "Welcome123"

    var httpntlm = require('httpntlm');

    httpntlm.get({
        url: url,
        username: username,
        password: password,
        workstation: 'KanbanBoard',
        domain: 'NA'
    }, function (err, resp) {
        if (err) return err;

        res.setHeader("ContentType", "apllication/json")
        res.send(resp.body);
    });
})


router.get("/tfs/project/:project_id/queries", function (req, res) {

    var db = req.db;
    var project_id = req.params.project_id;
    var collection = db.get('project');
    collection.findOne({"_id": project_id}, {}, function (e, proj) {
        var url = proj.tfs.url + "/" + proj.tfs.group + "/" + proj.tfs.tfsproject +
                "/_api/_wit/queries?__v=3&includeQueryTexts=true"
            , domain = "NA"
            , username = "shafqat.ahmed"
            , password = "Welcome123"
        var httpntlm = require('httpntlm');

        httpntlm.get({
            url: "https://cmra.wkglobal.com:8088/tfs/FS-RC/HMDAWiz-Agile/_workItems", //url,
            username: username,
            password: password,
            workstation: 'KanbanBoard',
            domain: 'NA'
        }, function (err, resp) {
            if (err) return err;
            //console.log(resp.headers);
            res.setHeader("ContentType", "apllication/json")
            res.send(resp.body);
        });

    });
})

// https://cmra.wkglobal.com:8088/tfs/FS-RC/_api/_wit/workitems?__v=3&ids=18125
router.get("/tfs/project/:project_id/workitem/:workitem_id", function (req, res) {

    var db = req.db;
    var project_id = req.params.project_id;
    var workitem_id = req.params.workitem_id;
    var collection = db.get('project');
    collection.findOne({"_id": project_id}, {}, function (e, proj) {
        var url = proj.tfs.url + "/" + proj.tfs.group + "/" + proj.tfs.tfsproject +
                "/_api/_wit/workitems?__v=3&ids=" + workitem_id
            , domain = "NA"
            , username = proj.tfs.user
            , password = proj.tfs.password
        var httpntlm = require('httpntlm');

        httpntlm.get({
            url: url,
            username: username,
            password: password,
            workstation: 'KanbanBoard',
            domain: 'NA'
        }, function (err, resp) {
            if (err) return err;
            //console.log(resp.headers);
            res.setHeader("ContentType", "apllication/json")
            res.send(resp.body);
        });

    });
})


module.exports = router;