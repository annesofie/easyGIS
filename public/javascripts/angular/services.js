/**
 * Created by AnneSofie on 29.02.2016.
 */


easygis.factory('polygonLayerService', ['$http', function($http) {

    function addpolygonlayer(name, dist, tileurl, tablename){
        return $http.post('layers/addpolygonlayer/', {name: name, dist: dist, tileURL: tileurl, datatype: 'Polygon', tablename: tablename});
    }
    function getpolygonlayers(){
        return $http.get('layers/polygonlayer');
    }
    function getpolygonlayerId(id){
        return $http.get('layers/polygonlayer/'+id);
    }
    function getpolygonlayerName(name){
        return $http.get('layers/polygonlayer/one/'+name);
    }
    function deletepolygonlayerId(id){
        return $http.delete('layers/polygonlayer/'+id);
    }

    return ({
        addpolygonlayer: addpolygonlayer,
        getPolyLayers: getpolygonlayers,
        getPolygonbyId: getpolygonlayerId,
        getPolygonbyName: getpolygonlayerName,
        deletePolygonbyId: deletepolygonlayerId
    });
}]);
easygis.factory('pointLayerService', ['$http', function($http) {

    function addpointlayer(name, tileurl, tablename){
        return $http.post('layers/addpointlayer/', {name: name, tileURL: tileurl, datatype: 'Point', tablename: tablename});
    }
    function getpointlayers(){
        return $http.get('layers/pointlayer');
    }
    function getpointlayerId(id){
        return $http.get('layers/pointlayer/'+id);
    }
    function getpointlayerName(name){
        return $http.get('layers/pointlayer/one/'+name);
    }
    function deletepointlayerId(id){
        return $http.delete('layers/pointlayer/'+id);
    }

    return ({
        addPointLayer: addpointlayer,
        getPointLayers: getpointlayers,
        getPointbyId: getpointlayerId,
        getPointbyName: getpointlayerName,
        deletePointbyId: deletepointlayerId
    });
}]);
easygis.factory('lineLayerService', ['$http', function($http) {

    function addlinelayer(name, tileurl, tablename){
        return $http.post('layers/addlinelayer/', {name: name, tileURL: tileurl, datatype: 'Line', tablename: tablename});
    }
    function getlinelayers(){
        return $http.get('layers/linelayer');
    }
    function getlinelayerId(id){
        return $http.get('layers/linelayer/'+id);
    }
    function getlinelayerName(name){
        return $http.get('layers/linelayer/one/'+name);
    }
    function deletelinelayerId(id){
        return $http.delete('layers/linelayer/'+id);
    }

    return ({
        addLineLayer: addlinelayer,
        getLineLayers: getlinelayers,
        getLinebyId: getlinelayerId,
        getLinebyName: getlinelayerName,
        deleteLinebyId: deletelinelayerId
    });
}]);

easygis.factory('geoJsonService', ['$http', function($http) {

    function getgeojson(URL){
        return $http.get(URL);
    }

    return ({
        getgeojson: getgeojson
    })
}]);
easygis.factory('layerService', ['$http', function($http){

    function getLayerJson(URL){
        return $http.get(URL);
    }
    function postLayerJson(URL, layer){
        return $http.post(URL, layer);
    }

    return ({
        getLayer: getLayerJson,
        postLayer: postLayerJson
    })

}]);

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