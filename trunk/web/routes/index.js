var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/board', function(req, res) {
    res.render('board', { title: 'Express' });
});

router.get('/tfs', function (req, res) {

    res.render('tfs',
        { title: 'Express' }
    );
});

module.exports = router;
