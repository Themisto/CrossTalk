var express = require('express');
var bodyParser = require('body-parser');
var handlers = require('./handlers.js');

var app = express();

// This is for redirecting unsecure connections to https, not needed for development
// app.all('*', function(req, res, next) {
//   if (req.secure){
//     return next();
//   }
//   res.redirect('https://' + req.hostname + req.url);
// });

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/'));



// ------------ page routes ------------
app.get('/', handlers.index);
app.get('/list', handlers.index);
app.get('/video', handlers.index);
// -------------------------------------





// ------------ api routes ------------

// ------------------------------------




module.exports = app;