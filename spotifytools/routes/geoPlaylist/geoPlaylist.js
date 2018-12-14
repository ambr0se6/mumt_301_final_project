var express = require('express');
var router = express.Router();

/* GET geoPlaylist page. */
router.get('/', function(req, res, next) {
  res.render('geoPlaylist', { project: 'geoPlaylist Spotify Project', reason: 'MUMT 301'});
});

module.exports = router;