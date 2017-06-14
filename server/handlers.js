var axios = require('axios');
var path = require('path');
var xmlParser = require('xml2js');
var config = require('./config.js');
var utils = require('./utils');
var User = require('../database/models/user.js');
var formidable = require('formidable');
var wsClient = require('websocket').client;
var fs = require('fs');
var streamBuffers = require('stream-buffers');
var jwt = require('jwt-simple');

// @todo: 'public' is a reserved keyword. Consider refactoring.
var public = path.join(__dirname + '/../public/');

module.exports = {

  index: (req, res) => {
    res.sendFile(public + 'index.html');
  },

  login: (req, res) => {
    User.newUser(req.body.userID, req.body.tokenPayload);
    res.end();
  },

  translate: (req, res) => {
    var {text, fromLang, toLang} = req.body;
    utils.translateText(text, fromLang, toLang)
    .then(({data}) => {
      xmlParser.parseString(data, function (error, translatedText) {
        if (error) {
          console.log('Error parsing XML.');
          console.log(error);
        } else {
          res.send(translatedText['string']['_']);
        }
      })
    })
    .catch((error) => {
      console.log('Error serving translate request.');
      console.log(error);
    });
  },

  authenticate: (req, res, next) => {
    try {
      let token = req.header('x-access-token').split(' ')[1];
      let payload = jwt.decode(token, process.env.AUTH0_SECRET, 'RS256');
      req.body.tokenPayload = payload;
      req.body.userID = payload.user_id.split('|')[1];
      next();
    } catch (e) {
      console.log('Warning: Token from client has expired, access denied');
      res.sendStatus(401);
    }
  },

  getRating: (req, res) => {
    User.getRatingById(req.body.userID)
    .then((rating) => {
      res.send(rating);
    })
    .catch((err) => {
      console.error('Failed to get rating!', err);
      res.sendStatus(500);
    });
  },

  getFriends: (req, res) => {
    User.getFriendsById(req.body.userID)
    .then((friends) => {
      res.send(friends);
    })
    .catch((err) => {
      console.error('Failed to get friends!', err);
      res.sendStatus(500);
    });
  },

  getData: (req, res) => {
    // let id = utils.idFromToken(req.header('x-access-token').split(' ')[1]);
    User.getDataById(req.body.userID)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error('Failed to get metrics data!', err);
      res.sendStatus(500);
    });
  },

  updateAvatar: (req, res) => {
    let id = utils.idFromToken(req.header('x-access-token').split(' ')[1]);
    User.updateAvatar(id, req.body.imageURL)
    .then((user) => {
      res.send(user.data.imageURL);
    })
    .catch((err) => {
      console.error('Failed to update avatar!', err);
      res.sendStatus(500);
    });
  },

  // Process, transcribe, and translate video chat audio file that client is trying to upload.
  // Streams audio to translation service, gets translated text back.
  // Triggered by toggling button on video page (from false to true), speaking into the mic, then toggling the button again (from true to false).
  // Client-side code is in /src/pages/video/components/VideoStream.vue.
  transcribe: (req, res) => {
    var accessToken;
    var audioStream = new formidable.IncomingForm();
    var [fromLang, toLang] = req.params.fromLang_toLang.split('_');
    var filePath = __dirname + `/uploads/snippet.wav`;

    audioStream.on('error', function (error) {
      console.log(error);
      console.log('Error parsing file for transcription.');
    });

    audioStream.on('fileBegin', function (name, file) {
      console.log('Starting upload...');
      file.path = filePath;
      console.log('saved to:', file.path);
    });

    audioStream.on('end', function () {
      // Get auth token
      var query = `?Subscription-Key=${process.env.TRANSCRIBER_KEY}`;

      axios.post(process.env.TRANSCRIBER_AUTH_URL + query)
      .then(({data}) => {
        accessToken = data;

        // This is the file uploaded by the client.
        var file = filePath;

        // This is a sample of a properly-encoded .wav file.
        // var file = __dirname + '/uploads/helloworld.wav';

        // Hook up the necessary websocket events for sending audio and processing the response.
        // Language is set in the query string as 'from=' and 'to='
        var transcriptionURL = process.env.TRANSCRIBER_SERVICE_URL + `?api-version=1.0&from=${fromLang}&to=${toLang}`;

        // Socket for connecting to the speech translate service.
        var ws = new wsClient();

        // Event for connection failure.
        ws.on('connectFailed', function (error) {
          console.log('Initial connection failed: ' + error.toString());
        });

        // Event for connection success.
        ws.on('connect', function (connection) {
          console.log('Websocket client connected');

          // Process message that is returned.
          connection.on('message', processMessage);

          connection.on('close', function (reasonCode, description) {
            console.log('Connection closed: ' + reasonCode);
          });

          connection.on('error', function (error) {
            console.log('Connection error: ' + error.toString());
          });

          // Send audio file to the websocket endpoint.
          sendData(connection, file);
        });

        // Connect to the service.
        ws.connect(transcriptionURL, null, null, {Authorization: 'Bearer ' + accessToken});
      })
      .catch(error => {
        console.log(error);
        console.log('Error getting auth token for transcription');
      });
    });

    audioStream.parse(req);

    // ========================================================================
    // == Helper functions. Will move to utils.js =============================
    // ========================================================================
    // Process the response from the service
    function processMessage(message) {
      // result has two properties we care about:
      //   - recognition: speech-to-text, not translated.
      //   - translation: speech-to-text, translated.
      var result = JSON.parse(message.utf8Data);
      res.end(result.translation);
    }

    // load the file and send the data to the websocket connection in chunks
    function sendData(connection, filename) {

      // the streambuffer will raise the 'data' event based on the frequency and chunksize
      var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        frequency: 100,   // in milliseconds.
        chunkSize: 32000  // 32 bytes per millisecond for PCM 16 bit, 16 khz, mono.  So we are sending 1 second worth of audio every 100ms
      });

      // read the file and put it to the buffer
      myReadableStreamBuffer.put(fs.readFileSync(filename));

        // silence bytes.  If the audio file is too short after the user finished speeaking,
        // we need to add some silences at the end to tell the service that it is the end of the sentences
        // 32 bytes / ms, so 3200000 = 100 seconds of silences
      myReadableStreamBuffer.put(new Buffer(3200000));

      // no more data to send
      myReadableStreamBuffer.stop();

      // send data to underlying connection
      myReadableStreamBuffer.on('data', function (data) {
        connection.sendBytes(data);
      });

      myReadableStreamBuffer.on('end', function () {
        console.log('All data sent, closing connection');
        connection.close(1000);
      });
    }
  }
};