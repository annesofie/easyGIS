/**
 * Created by AnneSofie on 29.02.2016.
 */

easygis.factory('Upload', ['$q', function(){
    var reader = new FileReader();
    var geoJsonData = new ol.format.GeoJSON();

    return ({
        handleFile: handleFile
    });

    function handleFile(file){
        var name = file.name;
        if(name.endsWith('.zip')){
            return handleZip(file);
        }else if (name.endsWith('.sos')){
            return handleSosi(file);
        }
    }
    function handleSosi(file){
        var deferred = $q.defer();
        //Create a parser
        var parser = new SOSI.Parser();
        reader.onload = function(e) {
            //Parse SOSI-data
            var sosidata = parser.parse(e.target.result);
            //get as GeoJson
            deferred.resolve(sosidata.dumps('geojson'));
        };
        reader.readAsText(file);
        return deferred.promise;
    }

    function handleZip(file) {
        var deferred = $q.defer();
        reader.onload = function(e) {
            //When the reader is done reading, send the result to the shp.js library
            shp(e.target.result).then(function(geojson) {
                deferred.resolve(geojson);
            });
        };
        reader.readAsArrayBuffer(file);
        return deferred.promise;
    }

}]);

easygis.factory('Layers', function(){

    var layers = [];

    return layers;
});

easygis.factory('BufferLayer', function(){

    var bufflayer = {'layer': 'objs', 'name': 'hei'};

    var addBuffLayer = function(newobj, name) {
        bufflayer.layer = newobj;
        bufflayer.name = name;
    };
    var removeBuffLayer = function() {
        if(bufflayer){
            bufflayer.pop();
        }
    };
    var getBuffLayer = function(){
        return bufflayer;
    };

    return {
        addBuffLayer: addBuffLayer,
        removeBuffLayer: removeBuffLayer,
        getBuffLayer: getBuffLayer
    };
});
