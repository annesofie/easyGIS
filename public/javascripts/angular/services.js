/**
 * Created by AnneSofie on 29.02.2016.
 */


easygis.factory('polygonLayerService', ['$http', function($http) {

    function addpolygonlayer(name, buffname, tileurl){
        return $http.post('layers/addpolygonlayer/', {name: name, name_buff: buffname, tileURL: tileurl});
    }

    function getpolygonlayers(){
        return $http.get('layers/polygonlayer');
    }

    function getpolygonlayer(id){
        return $http.get('layers/polygonlayer/:id');
    }

    return ({
        addpolygonlayer: addpolygonlayer,
        getPolyLayers: getpolygonlayers,
        getPolygon: getpolygonlayer
    });
}]);

easygis.factory('PointLayers', function(){

    var layers = { layers: [
        {id: 0, name: 'Pub', layer: 'empty'},
        {id: 1, name: 'Birkebeinerroute', layer: 'empty'},
        {id: 2, name: 'Restaurants', layer: 'empty'},
        {id: 3, name: 'Innbyggertall', layer: 'empty'},
        {id: 4, name: 'Trafikkmengde', layer: 'empty'}
    ]};

    return layers;
});

easygis.factory('PolygonLayer', function(){

    var polylayer = { layers: [
        {id: 0, name: 'Pub', layer: 'empty'},
        {id: 1, name: 'Birkebeinerroute', layer: 'empty'},
        {id: 2, name: 'Restaurants', layer: 'empty'},
        {id: 3, name: 'Innbyggertall', layer: 'empty'},
        {id: 4, name: 'Trafikkmengde', layer: 'empty'}
    ]};


    var addBuffLayer = function(id, name, newobj) { //Add new polygonlayer to the end
        polylayer.layers.push(
            {id: id, name: name, layer: newobj}
        );
    };
    var removeBuffLayer = function(id) {
        if(polylayer.id == id){
            polylayer.layers.pop();
        }
    };
    var getPolygonLayer = function(){
        return polylayer.layers;
    };
    var getLayer = function(id){
        if(polylayer.id == id){
            return polylayer;
        }
    };

    return {
        addBuffLayer: addBuffLayer,
        removeBuffLayer: removeBuffLayer,
        getPolygonLayer: getPolygonLayer,
        getlayer: getLayer
    };
});


/*easygis.factory('Upload', ['$q', function(){
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

}]);*/