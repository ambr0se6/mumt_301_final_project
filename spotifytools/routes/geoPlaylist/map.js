var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('map', { step: '1' });
});

module.exports = router;