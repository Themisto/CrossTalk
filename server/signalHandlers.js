var User = require('../database/models/user.js');
var utils = require('./utils.js');

module.exports = {

  // User attempting to join or create a room
  enterRoom: (room, socket, io) => {
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
  },

  // User attempting to send WebRTC (ICECandidates, session descriptions) data to other user
  relay: (data, socket, io) => {
    console.log(`Relaying "${data.message.type}" message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('relay', data.message);
  },

  control: (data, socket, io) => {
    // console.log(`Relaying "${data.message.type}" message from socket "${socket.id}" to room "${data.room}"`);
    console.log('control');
    socket.to(data.room).emit('control', data.message);
  },

  // User attempt to send text chat message to other user
  message: (data, socket, io) => {
    console.log(`Relaying chat message from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('message', data.message);
  },

  // User attempt to send text chat message to other user
  translateText: (data, socket, io) => {
    console.log(`Relaying chat translateText from socket "${socket.id}" to room "${data.room}"`);
    socket.to(data.room).emit('translateText', data.message);
  },

  // Received metricsdata from client
  metric: (data, socket, io) => {
    console.log(`"${data.type}" type metrics data received from client`);
    let userID = utils.idFromToken(data.idToken);
    // Store data in database
    User.updateCallMetricsById(userID, data.sessionData);
  }

};
