var mongoose = require('mongoose');
var utils = require('../../server/utils.js');
// There seems to be a bug in certain situations (namely saving in the updateCallMetricsById method)
// when using mongoose with bluebird promises
// var Promise = require('bluebird');
mongoose.Promise = Promise;

// ========================
// =========Schema=========
// ========================

var userSchema = new mongoose.Schema({
  // '_id', as opposed to 'id', overwrites the default mongoose document id
  _id: {
    type: String,
    required: true,
    unique: true
  },
  publicID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    auto: true
  },
  name: String,
  // May add an email syntax validator in the future
  email: String,
  // TODO: Look into turning friends into a mongoose Population
  friends: [{type: String, ref: 'User'}],
  rating: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  },
  settings: {
    knownLanguages: [String]
  },
  data: {
    imageURL: {type: String, default: 'https://ca.slack-edge.com/T0455847Q-U048WUTPW-c9aad4cb38d9-48'},
    languageTime: Object,
    callHistory: [{date: Date, duration: Number, fromLang: String, toLang: String}]
  }
}, {toObject: { virtuals: true }, toJSON: { virtuals: true }});

// ========================
// ========Virtuals========
// ========================

// These may be accessed like any other property on a document

// Virtual that calculates and returns the user's rating as a percentage
userSchema.virtual('rating.percentage').get(function() {
  return (this.rating.upvotes * 100) / Math.max(this.rating.upvotes + this.rating.downvotes, 1);
});

// Virtual that calculates and returns the user's net rating
userSchema.virtual('rating.net').get(function() {
  return this.rating.upvotes - this.rating.downvotes;
});

// =========================
// =========Methods=========
// =========================

// =========Getters=========

// returns a promise with the user's friends
userSchema.methods.getFriends = function() {
  // Currently returns all fields of each friend
  // See http://mongoosejs.com/docs/api.html#document_Document-populate for options
  return new Promise((resolve, reject) => {
    this.populate('friends').execPopulate()
    .then(user => {
      resolve(user.friends);
    })
    .catch(reject);
  });
};

// Returns a promise with the user's rating data
userSchema.statics.getRatingById = function(id) {
  return new Promise((resolve, reject) => {
    this.findOne({_id: id}).then(user => {
      let rating = {
        upvotes: user.rating.upvotes,
        downvotes: user.rating.downvotes,
        percentage: user.rating.percentage,
        net: user.rating.net
      };
      resolve(rating);
    }).catch(reject);
  });
};

// Populate and retrieve a user's friends list
userSchema.statics.getFriendsById = function(id) {
  let user;
  return new Promise((resolve, reject) => {
    this.findOne({_id: id})
    .then(user => user.populate('friends').execPopulate())
    .then(user => {
      resolve(user.friends);
    })
    .catch(reject);
    // })
    // .catch(reject);
  });
};

// Returns a promise with the user's metrics data
userSchema.statics.getDataById = function(id) {
  return new Promise((resolve, reject) => {
    this.findOne({_id: id})
    .then(user => {
      resolve(user.data);
    })
    .catch(reject);
  });
};

userSchema.statics.getPublicId = function(id) {
  return new Promise((resolve, reject) => {
    this.findOne({_id: id})
    .then(user => {
      resolve(user.publicID);
    })
    .catch(reject);
  });
};

// =========Setters=========

// Add a new user with the given id to the database, unless a user with that id exists
userSchema.statics.newUser = function(id, profileData) {
  return this.find({_id: id}, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      if (user.length === 0) {

        let newUserProfile = {
          _id: id,
          name: profileData.name,
          email: profileData.email,
          data: {
            languageTime: {}
          }
        };
        if (profileData.picture) { newUserProfile.data.imageURL = profileData.picture; }

        var account = new this(newUserProfile);

        account.save((err, account) => {
          if(err) {
            console.log(err);
            console.log("Could not create user.");
          } else {
            console.log("New User Created.");
          }
        });
      } else {
        console.log('User Already Exists.');
      }
    }
  });
};

// Add the user matching the given id to the current user's friends list
// Returns a promise
userSchema.statics.addFriendByPublicId = function(id, publicID) {
  let user;
  return new Promise((resolve, reject) => {
    this.findOne({_id: id})
    .then(userDocument => {
      user = userDocument;
      return this.findOne({publicID: publicID});
    })
    .then(friend => {
      user.friends.push(friend._id);
      return user.save();
    })
    .then(resolve)
    .catch(reject);
  });
};

// Update languageTime and callHistory data
userSchema.statics.updateCallMetricsById = function(id, sessionData) {
  sessionData.toLang = utils.tagToLang(sessionData.toLang);
  sessionData.fromLang = utils.tagToLang(sessionData.fromLang);
  this.findOne({_id: id})
  .then(user => {
    if (!user.data.languageTime) {
      user.data.languageTime = {};
    }
    if (!user.data.languageTime[sessionData.toLang]) {
      user.data.languageTime[sessionData.toLang] = 0;
    }
    user.data.languageTime[sessionData.toLang] += sessionData.duration;
    user.markModified('data.languageTime');
    // Consider using an update query with the $push operator instead for performance benefits
    user.data.callHistory.unshift(sessionData);
    user.save().then();
  });
}

// Increment ratings.upvotes and returns the updated document in a query
// Usage: User.upvoteById(user_id).then((doc) => {}) or User.upvoteById(user_id).exec()
userSchema.statics.upvoteById = function(id) {
  return this.findOneAndUpdate({_id: id}, { $inc: { "rating.upvotes": 1 } }, {new: true});
};

// Increment ratings.downvotes and returns the updated document in a query
// Usage: User.downvoteById(user_id).then((doc) => {}) or User.downvoteById(user_id).exec()
userSchema.statics.downvoteById = function(id) {
  return this.findOneAndUpdate({_id: id}, { $inc: { "rating.downvotes": 1 } }, {new: true});
};

userSchema.statics.updateAvatar = function(id, imageURL) {
  return this.findOneAndUpdate({_id: id}, { $set: { "data.imageURL": imageURL } }, {new: true});
};

var User = mongoose.model('User', userSchema);

module.exports = User;
