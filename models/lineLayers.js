/**
 * Created by AnneSofie on 10.04.2016.
 */

var mongoose = require('mongoose');

function inspector (val, schematype) {
    if (schematype.options.required) {
        return schematype.path + ' is required';
    } else {
        return schematype.path + ' is not';
    }
}
var lineLayerSchema = new mongoose.Schema({
    name: {type: String, required: true, get: inspector},
    tileURL: {type: String, get: inspector},
    datatype: {type: String, required: true, get: inspector},
    tablename: {type: String, get: inspector}   //Tablename in CartoDB
});

module.exports = mongoose.model('lineLayers', lineLayerSchema);