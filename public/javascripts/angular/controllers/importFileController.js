/**
 * Created by AnneSofie on 11.03.2016.
 */

easygis.controller('importFileController', ['$scope', 'Upload', '$timeout',
    function($scope, Upload, $timeout) {

        $scope.activeLayers = [];
        $scope.newLayerName = '';

        $scope.$watch('file', function() {
            if ($scope.file != null) {
                Upload.handleFile($scope.file).then(function(data) {
                    var crs = 'EPSG:4326';
                    if(data.crs) {
                        crs = data.crs.properties.name;
                        console.log(crs + ' = crs');
                    }
                    var features = geoJSONFormat.readFeatures(data, {dataProjection: crs, featureProjection: 'EPSG:3857'});
                    $scope.vectorSource.addFeatures(features);
                })
            }
        })
        $scope.log = '';

    }])