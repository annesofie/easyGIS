/**
 * Created by AnneSofie on 21.02.2016.
 */

var mangoose = require('mongoose');
var geoFeatureSchema = require('./geoFeatureSchema.js');

//Define Point model
module.exports = mangoose.model('Point', geoFeatureSchema);