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
      'ar': 'Arabic',
      'zh-hans': 'Chinese (Simplified)',
      'zh-hant': 'Chinese (Traditional)',
      'en': 'English',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'ja': 'Japanese',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'es': 'Spanish'
    };
    return tags[tag.toLowerCase()] || null;
  },

  langToTag: function (lang) {
    let langs = {
      'arabic': 'ar',
      'chinese (simplified)': 'zh-Hans',
      'chinese (traditional)': 'zh-Hant',
      'english': 'en',
      'french': 'fr',
      'german': 'de',
      'italian': 'it',
      'japanese': 'ja',
      'portuguese': 'pt',
      'russian': 'ru',
      'spanish': 'es'
    };
    return langs[lang.toLowerCase()] || null;
  }
};
