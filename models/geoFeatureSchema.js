/**
 * Created by AnneSofie on 21.02.2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoFeature = new Schema({

    location: {  //Holding geometry type and coordinates
        type: {
            type: String,
            enum: ["Point", "Multipoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"]},
        coordinates: []
    }
});

//Set geospatial index, so we can use spatial queries
geoFeature.index({ location: "2dsphere" });

module.exports = geoFeature;
