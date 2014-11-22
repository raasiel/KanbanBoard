var express = require('express');
var router = express.Router();

/* View the login page */
router.get('/login', function(req, res) {
    res.render('user/login', { title: 'KanbanBoard' });
});

/* View the register page */
router.get('/register', function(req, res) {
    res.render('user/register', { title: 'KanbanBoard : Register New User' });
});

/* View the forgot password page */
router.get('/forgot-password', function(req, res) {
    res.render('user/forgot-password', { title: 'KanbanBoard : Register New User' });
});

/* Process the login post */
router.post('/login', function(req, res) {
    res.render('user/login', { title: 'KanbanBoard' });
});

module.exports = router;