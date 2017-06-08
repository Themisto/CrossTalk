require('./config');
var server = require('./routes.js');
var https = require('https');
var http = require('http');
var fs = require('fs');

// For deployment use port 80
// var port = process.env.PORT || 80;
var port = process.env.PORT || 8000;

// More deployment stuff, for https connections use port 443 and credentials
// var options = {
//   key: fs.readFileSync('/etc/pki/tls/private/localhost.key', 'utf8'),
//   cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt', 'utf8')
// }

// var secureServer = https.createServer(options, server).listen(443);
// var io = require("socket.io").listen(secureServer);


var server = http.createServer(server).listen(port);

var io = require("socket.io").listen(server);


console.log(`Signal server listening on port ${port}`);


io.on('connection', function(socket) {
  console.log(`Connection received from socket "${socket.id}"`);

  // User attempting to join or create a room
  socket.on('enter room', function(room) {
    console.log(`Socket "${socket.id}" requested to join room "${room}"`);

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
    console.log(`Relaying "${data.message.type}" message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('relay', data.message);
  });

  // User attempt to send text chat message to other user
  socket.on('message', function(data) {
    console.log(`Relaying chat message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('message', data.message);
  });

  // User attempt to send text chat message to other user
  socket.on('translateText', function(data) {
    console.log(`Relaying chat translateText from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('translateText', data.message);
  });

});
