var mongoose = require('mongoose');
var Promise = require('bluebird');
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
    languageHistory: {
      // This appears to be the only way of storing classical objects/
      // hashtables in mongoose. A .markModified('data.languageHistory')
      // will be required before any .save()
      type: mongoose.Schema.Types.Mixed
    }
  }
});

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

// Add the user matching the given id to the current user's friends list
// Returns a promise
userSchema.methods.addFriendById = function(id) {
  return new Promise((resolve, reject) => {
    // console.log(this.constructor);
    this.constructor.findOne({_id: id})
    .then(user => {
      this.friends.push(user);
      this.save().then(resolve).catch(reject);
    })
    .catch(reject);
  });
};


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

userSchema.statics.getFriendsById = function(id) {
  // Currently returns all fields of each friend
  // See http://mongoosejs.com/docs/api.html#document_Document-populate for options
  return new Promise((resolve, reject) => {
    this.findOne({_id: id})
    .then(user => {
      user.populate('friends').execPopulate()
      .then(user => {
        resolve(user.friends);
      })
      .catch(reject);
    })
    .catch(reject);
  });
};



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

userSchema.statics.newUser = function(id) {
  return this.find({_id: id}, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      if (user.length === 0) {
        var account = new this({
          _id: id
        });

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
  })
};

var User = mongoose.model('User', userSchema);
// User.newUser('potato');
// User.newUser('tomato');
// User.newUser('carrot');
// User.upvoteById('potato').exec();
// User.downvoteById('potato').exec();
module.exports = User;
