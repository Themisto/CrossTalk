require('./config');
var server = require('./routes.js');
var db = require('../database/db.js');
var https = require('https');
var http = require('http');
var fs = require('fs');
var signal = require('./signalRoutes.js');

// For deployment use port 80
var port = process.env.PORT || 8000;
var sslServer;

if (process.env.PORT == 80) {
  // More deployment stuff, for https connections use port 443 and credentials
  var options = {
    key: fs.readFileSync('/etc/pki/tls/private/localhost.key', 'utf8'),
    cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt', 'utf8')
  };
  sslServer = https.createServer(options, server).listen(443);
}

var server = http.createServer(server).listen(port);

var io = require('socket.io').listen(sslServer || server);
console.log(`Signal server listening on port ${port}`);
signal(io);
