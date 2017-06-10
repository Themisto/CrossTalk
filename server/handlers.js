var axios = require('axios');
var path = require('path');
var xmlParser = require('xml2js');
var config = require('./config.js');
var utils = require('./utils');
var jwt = require('jwt-simple');
var User = require('../database/models/user.js');

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

  getRating: (req, res) => {
    let id = getID(req.header('x-access-token').split(' ')[1]);
    User.getRatingById(id)
    .then((rating) => {
      res.send(rating);
    })
    .catch((err) => {
      console.error('Failed to get rating!', err);
      res.sendStatus(500);
    });
  },

  getFriends: (req, res) => {
    // let id = getID(req.header('x-access-token').split(' ')[1]);
    let id = req.header('x-access-token').split(' ')[1];
    User.getFriendsById(id)
    .then((friends) => {
      res.send(friends);
    })
    .catch((err) => {
      console.error('Failed to get friends!', err);
      res.sendStatus(500);
    });


  }


};