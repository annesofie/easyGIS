
var mongoose = require('mongoose');
var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function() {
    var greetings = this.name ? "Meow name is" + this.name : "I dont have a name";
    console.log(greetings);
}

module.exports = kittySchema;