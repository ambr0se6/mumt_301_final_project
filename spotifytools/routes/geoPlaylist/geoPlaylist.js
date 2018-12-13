var express = require('express');
var router = express.Router();

/* GET geoPlaylist page. */
router.get('/', function(req, res, next) {
  res.render('geoPlaylist', { title: 'geoPlaylist' });
});

module.exports = router;