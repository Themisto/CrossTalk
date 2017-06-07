
import io from './socket.io.js';

export default function(URL, verbose) {

  // Should point to deployed signal server
  let serverURL = URL || '/';
  let debug = verbose || false;

  function log() {
    debug && console.log.apply(console, ['Socket:', ...arguments]);
  };

  log(`Connecting to signal server at "${serverURL}"...`);
  let socket = io(serverURL);
  socket._room = null;

  // ====================================
  // ===============Mixins===============
  // ====================================

  /**
  * Send a 'relay' event to every other user in the room.
  * @param {Object} message - Any object with a type string.
  */
  socket.relay = function(message) {
    if (this._room) {
      let data = {
        room: this._room,
        message: message
      };
      this.emit('relay', data);
    } else {
      console.error('Error: Room not set. Has .join(room) been called?');
    }
  };

  /**
  * Send a 'message' event to every other user in the room.
  * @param {Object} message - The message object.
  * @param {number} message.id - The message id.
  * @param {string} message.text - The message text.
  */
  socket.message = function(message) {
    let data = {
      room: this._room,
      message: message
    };
    this.emit('message', data);
  };

  /**
  * Join a room.
  * @param {string} room - The name of the room to join.
  */
  socket.join = function(room) {
    if(!this._room) {
      this._room = room;
      log(`Attempting to join or create room "${this._room}"...`);
      this.emit('enter room', this._room);
    } else {
      console.error(`Error: .join() has already been called. Use .reset() to rejoin the room, or .reset(false) and .join(newRoom) to join a new room.`);
    }
  };

  /**
  * Reset connection to signal server.
  * @param {boolean} [join=true] - Attempt to automatically join last room used?
  */
  socket.reset = function (join) {
    join = join ? true : false;
    log(`Resetting connection to signal server at "${serverURL}"...`);
    this.disconnect();
    this.connect();
    if (join && this._room) {
      let room = this._room;
      this._room = null;
      this.join(room);
    }
  };

  return socket;

}
