/**
 * Created by shafqat on 9/12/14.
 */

function Authentication (app, routePrefix) {
    this.app = app;

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/loginSuccess',
            failureRedirect: '/loginFailure'
        })
    );

    app.get( routePrefix + '/loginFailure', function (req, res, next) {
        res.send('Failed to authenticate');
    });

    app.get(routePrefix + '/loginSuccess', function (req, res, next) {
        console.log(req);
        res.send('Successfully authenticated - ');
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
        }
    ));

    console.log ("intialized authentication ");
    return this;
};

module.exports = Authentication;