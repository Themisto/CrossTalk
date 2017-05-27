var server = require('./routes.js');

server.listen(process.env.PORT || 8000, function() {
  console.log('Server is listening on 8000');
});