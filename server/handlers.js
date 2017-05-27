var path = require('path');

var public = path.join(__dirname + '/../public/');

module.exports = {
  index: (req, res) => {
    res.sendFile(public + 'index.html');
  }
}