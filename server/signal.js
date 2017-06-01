
// On/off flag for log() method
const verbose = false;

const port = process.env.SIGNAL_PORT || 8001;
var io = require('socket.io')(port);

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
