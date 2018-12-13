var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var expressHbs = require('express-handlebars');
var logger = require('morgan');
var favicon = require('serve-favicon');

//Spotify credentials
var clientId = '090774b1b6b845bc990df0dc4b8335a6';
var clientSecret = '5fca5def4a834fffbf9af3faa2f3e999';
var redirectUri = 'http://localhost:3000/callback/';

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const routes = require('./routes');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
  clientSecret: clientSecret
});
var stateKey = 'spotify_auth_state';

var app = express();
app.use(favicon(path.join(__dirname,'public/images', 'favicon.ico')));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', routes);

app.get('/login', function(req, res){
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scopes = ['user-top-read', 'playlist-modify-public', 'user-read-private'];
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  console.log(authorizeURL);
  res.redirect(authorizeURL);
  console.log('OAuth has been triggered!');
});

app.get('/callback', function(req, res){
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // if(state == null || state !== storedState){
  //   res.redirect('/#' + querystring.stringify({
  //     error: 'state_mismatch'
  //   }));
  // } else {
  res.clearCookie(stateKey);
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);
    
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Login to Spotify' });
  });
});



// app.get('/refresh_token', function(req, res){
//   spotifyApi.refreshAccessToken().then(
//     function(data) {
//       console.log('The access token has been refreshed!');
   
//       // Save the access token so that it's used in future calls
//       spotifyApi.setAccessToken(data.body['access_token']);
//     },
//     function(err) {
//       console.log('Could not refresh access token', err);
//     }
//   );
// });

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
