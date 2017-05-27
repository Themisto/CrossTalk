var express = require('express');
var bodyParser = require('body-parser');
var handlers = require('./handlers.js');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/'));

// page routes
app.get('/', handlers.index);
app.get('/list', handlers.index);
app.get('/video', handlers.index);
// ------------

module.exports = app;