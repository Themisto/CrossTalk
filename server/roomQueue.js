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
        console.log('match: ', user);
        queue.splice(i, 1);
        res.end(`/room/${current.room}`);
        return;
      }
    }

    console.log('no match: ', user);
    user.room = newRoom(40);
    res.end(`/room/${user.room}`);
    queue.push(user);
  }
};