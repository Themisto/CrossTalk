var mongoose = require('mongoose');

// When we have a deployed database with a username and password,
// use 'mongodb://username:password@host:port/database?options...'
var databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/crosstalkdb';

mongoose.connect(databaseURL);

var db = mongoose.connection;

db.on('error', () => console.error('Failed to connect to database at ${databaseURL}'));

db.once('open', () => console.log('Successfully connected to database'));

module.exports = db;
