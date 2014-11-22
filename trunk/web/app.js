/* Get config and load config */

var activeConfig = require ("./modules/config");
var express = require('express');

/* Configure Express */
/* Preparing swig */
swig = require('swig');

var path = require('path');
var favicon = require('serve-favicon');
var loggerMorgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
//app.set('views', __dirname + '/views');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(loggerMorgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));

var db = require("./data/dbaccess.js");
app.use(function(req, res, next) {
    req.db = db;
    next();
});

//var x = require('./modules/context');
//var y = x(app, activeConfig);
//console.log(["x",x,y]);

var context = new require('./modules/context')(app, activeConfig);
var logger = new require("./modules/logging") (context);

app.use("/public", express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var api = require('./routes/api');
var user = require('./routes/user');

app.use('/', routes);
app.use("/api",api);
app.use("/user", user);

// Authentication stack
Authentication = require("./modules/authentication")
var auth = new Authentication (app, "/user");

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set ("port", activeConfig.port )
/// error handlers
// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log([err,__dirname]);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
//}

/*
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/

module.exports = app;
