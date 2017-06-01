var server = require('./routes.js');

// Start signal server
require('./signal.js');

var port = process.env.PORT || 8000;

server.listen(port, function() {
  console.log(`Web server listening on port ${port}`);
});

