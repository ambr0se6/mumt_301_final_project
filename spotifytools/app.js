var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var geoPlaylistRouter = require('./routes/geoPlaylist/geoPlaylist');
var mapRouter = require('./routes/geoPlaylist/map');
var loadingRouter = require('./routes/geoPlaylist/loading');
var resultsRouter = require('./routes/geoPlaylist/results');
var loggedInRouter = require('./routes/loggedIn');

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: "geoplaylist-1544820108234",
  keyFilename: './serviceAccountKey.json',
});

const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

//Spotify credentials
var clientId = '090774b1b6b845bc990df0dc4b8335a6';
var clientSecret = '5fca5def4a834fffbf9af3faa2f3e999';
var redirectUri = 'http://localhost:3000/callback/';

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
app.use('/loggedIn', loggedInRouter);

// Spotify Login Trigger
app.get('/login', function(req, res){
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scopes = ['user-top-read', 'playlist-modify-public', 'user-read-private'];
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  console.log(authorizeURL);
  res.redirect(authorizeURL);
  console.log('OAuth has been triggered!');
});

//Spotify Callback
app.get('/callback', function(req, res){
  var code = req.query.code || null;
  // var state = req.query.state || null;
  // var storedState = req.cookies ? req.cookies[stateKey] : null;

  // if(state == null || state !== storedState){
  //   res.redirect('/#' + querystring.stringify({
  //     error: 'state_mismatch'
  //   }));
  // } else {
  // res.clearCookie(stateKey);
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);
    
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      populateUserData();
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
  res.redirect('http://localhost:3000/');
});


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

function populateUserData(){
  spotifyApi.getMe().then(function(data) {
    console.log('Some information about the authenticated user', data.body);
   
    const document = firestore.doc('user/' + data.body.id);
    // Enter new data into the document.
    document.set({
      country: data.body.country,
      display_name: data.body.display_name,
      id: data.body.id, 
      image_url: data.body.images,
      loggedIn: true
    }).then(function() {
      console.log("User successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing User: ", error);
    }); 
  }, function(err) {
    console.log('Something went wrong!', err);
  });

}

module.exports = app;
