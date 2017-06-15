var express = require('express');
var bodyParser = require('body-parser');
var handlers = require('./handlers.js');
var rooms = require('./roomQueue.js');

var app = express();

// This is for redirecting unsecure connections to https, not needed for development
if (process.env.PORT === 80) {
  app.all('*', function(req, res, next) {
    if (req.secure){
      return next();
    }
    res.redirect('https://' + req.hostname + req.url);
  });
}

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/'));

// ------------ page routes ------------
app.get('/', handlers.index);
app.get('/list', handlers.index);
app.get('/video', handlers.index);
app.get('/room/:id', handlers.index);
app.get('/login', handlers.index);
app.get('/profile', handlers.index);

// -------------------------------------

// ------------ api routes ------------

// Add handlers.authenticate middleware to protected routes
// Requests to protected endpoints will require an 'x-access-token'
// header like so: x-access-token: Bearer jwt-token-here
app.get('/api/users/rating', handlers.authenticate, handlers.getRating);
app.get('/api/users/friends', handlers.authenticate, handlers.getFriends);
app.get('/api/users/data', handlers.authenticate, handlers.getData);
app.get('/api/users/publicId', handlers.authenticate, handlers.getPublicId);

app.put('/api/users/avatar', handlers.authenticate, handlers.updateAvatar);
app.put('/api/users/rating', handlers.authenticate, handlers.updateRating);

app.post('/api/new_user', handlers.authenticate, handlers.login);
app.post('/api/queue', rooms.findMatch);
app.post('/api/translate', handlers.translate);
app.post('/api/transcribe/:fromLang_toLang', handlers.transcribe);
app.post('/api/users/friends', handlers.authenticate, handlers.addFriend);

// ------------------------------------

module.exports = app;