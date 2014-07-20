/* Get config and load config */

var activeConfig = require ("./config.active.js");

var express = require('express');

/* Preparing swig */
swig = require('swig');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));

var db = require("./data/dbaccess.js");
app.use(function(req, res, next) {
    req.db = db;
    console.log("adding db");
    next();
});


app.use("/public", express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use("/api",api);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

// TODO: Move into a different router

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    })
);


app.get('/loginFailure', function (req, res, next) {
    res.send('Failed to authenticate');
});

app.get('/loginSuccess', function (req, res, next) {
    console.log(req);
    res.send('Successfully authenticated - ' + JSON.stringify(req.passport));
});

passport.serializeUser(function (user, done) {
    console.log("serializeUser")
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log("deserializeUser")
    done(null, user);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        return done(null, {username: username});
        /*
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, {username: username});
        });
        */
    }
));

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
