var handlers = require('./signalHandlers.js');

module.exports = function(io) {

  io.on('connection', function(socket) {

    console.log(`Connection received from socket "${socket.id}"`);

    socket.on('enter room', message => handlers.enterRoom(message, socket, io));
    socket.on('relay', message => handlers.relay(message, socket, io));
    socket.on('control', message => handlers.control(message, socket, io));
    socket.on('message', message => handlers.message(message, socket, io));
    socket.on('translateText', message => handlers.translateText(message, socket, io));
    socket.on('metric', message => handlers.metric(message, socket, io));

  });

};