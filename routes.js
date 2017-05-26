var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var public = path.join(__dirname + '/public/');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));






module.exports = app;