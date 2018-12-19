var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('loggedIn', { title: 'You are Logged In' });
});

module.exports = router;