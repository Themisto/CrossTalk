var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  friends: [String],
  rating: {
    upvotes: Number,
    downvotes: Number
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

// Virtual that calculates and returns the user's rating as a percentage
userSchema.virtual('rating.percentage').get(function() {
  return this.rating.upvotes / (this.rating.upvotes + this.rating.downvotes);
});

// Virtual that calculates and returns the user's net rating
userSchema.virtual('rating.net').get(function() {
  return this.rating.upvotes - this.rating.downvotes;
});

var User = mongoose.model('User', userSchema);

module.exports = User;
