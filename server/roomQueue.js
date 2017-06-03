var queue = [];

var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var newRoom = function(length) {
  var text = '';
  for (var i = 0; i < length; i++) {
    text += possible.charAt( Math.floor(Math.random() * possible.length) );
  }
  return text;
};


module.exports = {
  findMatch: (req, res) => {
    var user = req.body;
    // console.log(queue, user);
    for (var i = 0; i < queue.length; i++) {
      var current = queue[i];
      if (current.native_lang === user.foreign_lang && current.foreign_lang === user.native_lang) {
        var room = newRoom(40);
        console.log('found');

        queue.splice(i, 1);
        current.res.end(`/room/${room}`);

        res.end(`/room/${room}`);
        return;
      }
    }
    console.log('not found');
    user.res = res;
    queue.push(user);
  }
};