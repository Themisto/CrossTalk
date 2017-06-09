var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// ========================
// =========Schema=========
// ========================

var userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  // May add an email syntax validator in the future
  email: String,
  // TODO: Look into turning friends into a mongoose Population
  friends: [String],
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

// Increment ratings.upvotes and returns the updated document in a query
// Usage: User.upvoteById(user_id).then((doc) => {}) or User.upvoteById(user_id).exec()
userSchema.statics.upvoteById = function(id) {
  return this.findOneAndUpdate({id: id}, { $inc: { "rating.upvotes": 1 } }, {new: true});
};

// Increment ratings.downvotes and returns the updated document in a query
// Usage: User.downvoteById(user_id).then((doc) => {}) or User.downvoteById(user_id).exec()
userSchema.statics.downvoteById = function(id) {
  return this.findOneAndUpdate({id: id}, { $inc: { "rating.downvotes": 1 } }, {new: true});
};

userSchema.statics.newUser = function(id) {
  return this.find({id: id}, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      if (user.length === 0) {
        var account = new this({
          id: id
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
}

var User = mongoose.model('User', userSchema);

module.exports = User;
