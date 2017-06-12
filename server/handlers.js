var axios = require('axios');
var path = require('path');
var xmlParser = require('xml2js');
var config = require('./config.js');
var utils = require('./utils');
var jwt = require('jwt-simple');
var User = require('../database/models/user.js');
var formidable = require('formidable');
var wsClient = require('websocket').client;
var fs = require('fs');
var streamBuffers = require('stream-buffers');

var public = path.join(__dirname + '/../public/');


// jwt example, gets TOKEN from request
// jwt.decode(TOKEN, process.env.AUTH0_SECRET);

var getID = token => jwt.decode(token, process.env.AUTH0_SECRET, 'RS256').sub.split('|')[1];


module.exports = {
  index: (req, res) => {
    res.sendFile(public + 'index.html');
  },

  login: (req, res) => {
    // req.body = {
    //   token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3hvc2suYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA4MzU4MTMyNzk4ODgxNzc2ODg4IiwiYXVkIjoieDdJdGk3MUpKVjZhcHBZN3BwT0w2WGFqaTFoSDRGbUIiLCJleHAiOjE0OTQzODM3OTMsImlhdCI6MTQ5NDM0Nzc5M30.piHQCL1aHMlzgTZGzdkzm1s3lOvmlisn036MZkOp0Xc'
    // }
    console.log();
    User.newUser( getID(req.body.token) );
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

  // Process, transcribe, and translate video chat audio file that client is trying to upload.
  // Streams audio to translation service, gets translated text back.
  // Triggered by toggling button on video page (from false to true), speaking into the mic, then toggling the button again (from true to false).
  // Client-side code is in /src/pages/video/components/VideoStream.vue.
  transcribe: (req, res) => {
    var accessToken;
    var audioStream = new formidable.IncomingForm();

    audioStream.on('error', function (error) {
      console.log(error);
      console.log('Error parsing file for transcription.');
    });

    audioStream.on('fileBegin', function (name, file) {
      console.log('Starting upload...');
      file.path = __dirname + '/uploads/test.wav';
      console.log('saved to:', file.path);
    });

    audioStream.on('end', function () {
      // @debug
      console.log('Upload complete.');
      
      // Get auth token
      var query = `?Subscription-Key=${process.env.TRANSCRIBER_KEY}`;

      axios.post(process.env.TRANSCRIBER_AUTH_URL + query)
      .then(({data}) => {
        accessToken = data;

        // This is the file uploaded by the client.
        var file = __dirname + '/uploads/test.wav';

        // This is a sample of a properly-encoded .wav file.
        // var file = __dirname + '/uploads/helloworld.wav';

        // Hook up the necessary websocket events for sending audio and processing the response.
        // Language is set in the query string as 'from=' and 'to='
        var transcriptionURL = process.env.TRANSCRIBER_SERVICE_URL + '?api-version=1.0&from=en&to=es';
        
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
            res.send();
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
      if (message.type == 'utf8') {
        var result = JSON.parse(message.utf8Data)
        console.log('type:%s recognition:%s translation:%s', result.type, result.recognition, result.translation);
      } else {
        // text to speech binary audio data if features=texttospeech is passed in the url
        // the format will be PCM 16bit 16kHz mono
        console.log(message.type);
      }
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