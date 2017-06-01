var server = require('./routes.js');
var https = require('https');
var fs = require('fs');

// Start signal server
require('./signal.js');

var port = process.env.PORT || 80;

server.listen(port, function() {
  console.log(`Web server listening on port ${port}`);
});

var options = {
  key: fs.readFileSync('/etc/pki/tls/private/localhost.key', 'utf8'),
  cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt', 'utf8')
}

https.createServer(options, server).listen(443);
