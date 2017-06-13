var axios = require('axios');
var jwt = require('jwt-simple');

module.exports = {
  getTranslatorToken: function () {
    // POST to Microsoft's auth service every 9 minutes because
    // auth token expires every 10 minutes.
    // Documentation: http://docs.microsofttranslator.com/oauth-token.html.
    var query = `?Subscription-Key=${process.env.TRANSLATOR_KEY}`;

    // Returns a promise to caller.
    return axios.post(process.env.TRANSLATOR_AUTH_URL + query);
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
      return axios.get(process.env.TRANSLATOR_SERVICE_URL, {
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
  },

  idFromToken: function (token) {
    return jwt.decode(token, process.env.AUTH0_SECRET, 'RS256').sub.split('|')[1];
  },

  tagToLang: function (tag) {
    let tags = {
      'en': 'English',
      'es': 'Spanish',
      'ru': 'Russian',
      'zh-chs': 'Chinese',
      'nl': 'Dutch',
      'de': 'German',
      'fr': 'French',
      'hi': 'Hindi',
      'ar': 'Arabic'
    };
    return tags[tag.toLowerCase()] || null;
  },

  langToTag: function (lang) {
    let langs = {
      'english': 'en',
      'spanish': 'es',
      'russian': 'ru',
      'chinese': 'zh-CHS',
      'dutch': 'nl',
      'german': 'de',
      'french': 'fr',
      'hindi': 'hi',
      'arabic': 'ar'
    };
    return langs[lang.toLowerCase()] || null;
  }
};
