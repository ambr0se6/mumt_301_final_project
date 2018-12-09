// var SpotifyWebApi = require('spotify-web-api-node');
// var spotifyApi = new SpotifyWebApi(keys.spotifyKeys);
// var scope = ['user-top-read', 'playlist-modify-public']

// var authorizeURL = spotifyApi.createAuthorizeURL(scope, state).then(
//     function(data) {
//         console.log('The token expires in ' + data.body['expires_in']);
//         console.log('The access token is ' + data.body['access_token']);
//         console.log('The refresh token is ' + data.body['refresh_token']);
    
//         // Set the access token on the API object to use it in later calls
//         spotifyApi.setAccessToken(data.body['access_token']);
//         spotifyApi.setRefreshToken(data.body['refresh_token']);
//     },
//     function(err) {
//         console.log('Something went wrong!', err);
//     }
// );
// console.log('OAuth has been triggered!');
const button = document.getElementById('login');
button.addEventListener('click', function(e){
    console.log('button was clicked');
});