var axios = require('axios');
var path = require('path');
var xmlParser = require('xml2js');
var config = require('./config.js');
var utils = require('./utils');

var public = path.join(__dirname + '/../public/');

module.exports = {
  index: (req, res) => {
    res.sendFile(public + 'index.html');
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
  }
};