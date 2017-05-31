var server = require('./routes.js');
var port = process.env.PORT || 8000;

server.listen(port, function() {
  console.log(`Server is listening on ${port}`);
});