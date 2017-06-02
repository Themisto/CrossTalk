var express = require('express');
var fs = require('fs');
var https = require('https');
// On/off flag for log() method
const verbose = false;

const port = process.env.SIGNAL_PORT || 443;



var app = express();

// ... set up your express middleware, etc

var options = {
  key: fs.readFileSync('/etc/pki/tls/private/localhost.key', 'utf8'),
  cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt', 'utf8')
}
var server = https.createServer(options, app);
// attach your socket.io server to the express server
var io = require("socket.io").listen(server);
// server.listen(port);





console.log(`Signal server listening on port ${port}`);

io.on('connection', function(socket) {
  log(`Connection received from socket "${socket.id}"`);

  // User attempting to join or create a room
  socket.on('enter room', function(room) {
    log(`Socket "${socket.id}" requested to join room "${room}"`);

    // Add user to room
    socket.join(room);

    // Count number of users in room
    io.in(room).clients((err, clients) => {
      if (clients.length === 1) { // if previous empty room
        socket.emit('created room', room);
      } else {  // if occupied room
        socket.emit('joined room', room);
        socket.to(room).emit('callee joined', room);
      }
    });

  });

  // User attempting to send WebRTC (ICECandidates, session descriptions) data to other user
  socket.on('relay', function(data) {
    log(`Relaying "${data.message.type}" message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('relay', data.message);
  });

  // User attempt to send text chat message to other user
  socket.on('message', function(data) {
    log(`Relaying chat message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('message', data.message);
  });

});

var log = function(message) {
  verbose && console.log(`Signal: ${message}`);
}
