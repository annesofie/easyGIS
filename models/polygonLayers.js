var mongoose = require('mongoose');

var polygonLayerSchema = new mongoose.Schema({
    name: String,
    name_buff: String,
    tileURL: String
});

module.exports = mongoose.model('polygonLayers', polygonLayerSchema);