var server = require('./routes.js');

// Start signal server
require('./signal.js');

var port = process.env.PORT || 8000;

server.listen(port, function() {
  console.log(`Server is listening on ${port}`);
});

