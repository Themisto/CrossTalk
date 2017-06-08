var axios = require('axios');
var config = require('./config.js');

module.exports = {
  getTranslatorToken: function () {
    // POST to Microsoft's auth service every 9 minutes because
    // auth token expires every 10 minutes.
    // Documentation: http://docs.microsofttranslator.com/oauth-token.html.
    var query = `?Subscription-Key=${config.translatorAPIKey}`;

    // Returns a promise to caller.
    return axios.post(config.translatorAuthURL + query);
  },

  translateText: function (text, fromLang, toLang) {
    return this.getTranslatorToken()
    .then(({data}) => {
      // Return translatorToken
      return data;
    })
    .catch((error) => {
      console.log('Error authenticating translator.');
      console.log(error);
    })
    .then((translatorToken) => {
      return axios.get(config.translatorServiceURL, {
        params: {
          appid: `Bearer ${translatorToken}`,
          text: text,
          from: fromLang,
          to: toLang
        }
      });
    })
    .catch((error) => {
      console.log('Error translating text.');
      console.log(error);
    });
  }
};
