var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var favicon = require('serve-favicon');
// var mongoose= require('mongoose');

var indexRouter = require('./views/index');
var accountRouter = require('./routes/account');
var geoPlaylistRouter = require('./routes/geoPlaylist/geoPlaylist');
var mapRouter = require('./routes/geoPlaylist/map');
var loadingRouter = require('./routes/geoPlaylist/loading');
var resultsRouter = require('./routes/geoPlaylist/results');

var app = express();

//database setup with Mongo using mongoose
// mongoose.connect('localhost:27017/spotifytools');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public/images', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/geoPlaylist', geoPlaylistRouter);
app.use('/geoPlaylist/map', mapRouter);
app.use('/geoPlaylist/loading', loadingRouter);
app.use('/geoPlaylist/results', resultsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
