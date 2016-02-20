
var mongoose = require('mongoose');
var kittySchema = require('./kittySchema.js');

module.exports = mongoose.model('Kitty', kittySchema);

