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
        }
    }

    function handleGeoJson(file) {
        var deferred = $q.defer();
        reader.onload = function(e) {
            //When the reader is done reading
            try {
                json = JSON.parse(e.target.result);
            } catch (ex) {
                alert('ex when trying to parse json = ' + ex);
            }
            deferred.resolve(JSON.parse(e.target.result));
        };
        reader.readAsText(file);
        return deferred.promise;
    }

}]);