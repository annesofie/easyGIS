/**
 * Created by AnneSofie on 29.02.2016.
 */


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

easygis.factory('UploadService', ['$q', function($q){
    var reader = new FileReader();

    return ({
        handleFile: handleFile
    });

    function handleFile(file){
        var name = file.name;
        if (name.endsWith('.geojson')){
            return handleGeoJson(file);
        }else if(name.endsWith('.zip')){
            return handleZip(file);
        }else if (name.endsWith('.sos')){
            return handleSosi(file);
        }
    }

    function handleGeoJson(file) {
        var deferred = $q.defer();
        reader.onload = function(e) {
            //When the reader is done reading
            console.log(e.target);
            try {
                json = JSON.parse(e.target.result);
            } catch (ex) {
                alert('ex when trying to parse json = ' + ex);
            }
            console.log(JSON.parse(e.target.result));
            deferred.resolve(JSON.parse(e.target.result));
        };
        reader.readAsText(file);
        return deferred.promise;
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