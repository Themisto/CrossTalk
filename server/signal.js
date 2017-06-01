
const port = process.env.SIGNAL_PORT || 8001;
var io = require('socket.io')(port);

console.log(`Signal: Signal server listening on port ${port}`);

io.on('connection', function(socket) {
  console.log(`Signal: Connection received from socket ${socket.id}`);

  /* User attempting to join or create a room */
  socket.on('enter room', function(data) {
    log(socket, 'enter room', data);

    // Currently, this likely does not count the number of clients in a specific room
    let numClients = io.sockets.sockets.length;

    // add user to room
    socket.join(data);

    if (numClients === 1) { // if new room
      // emit 'created room'
      socket.emit('created room', data);
    } else {  // if room exists
      // emit 'joined room'
      socket.emit('joined room', data);
    }
  });

  /* User attempting to send WebRTC (ICECandidates, session descriptions)
  data to other user */
  socket.on('relay', function(data) {
    log(socket, 'relay', data);
    // emit 'relay', broadcast data directly back to other users
    socket.broadcast.emit('relay', data);
  });

  /* User attempt to send text chat message to other user */
  socket.on('message', function(data) {
    log(socket, 'message', data);
    // emit 'message', broadcast data directly back to other users
    socket.broadcast.emit('message', data);
  });

});

var log = function(socket, type, data) {
  console.log(`Signal: '${type}' received from socket ${socket.id}\n  data: ${data}`);
}
