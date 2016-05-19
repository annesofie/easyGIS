/**
 * Created by AnneSofie on 11.03.2016.
 */

easygis.controller('importFileController', ['$scope', 'UploadService', '$timeout',
    function($scope, UploadService, $timeout) {
        var fileData;
        $scope.file  = null;
        //File upload functions, used with ng-file-upload
        console.log($scope.file);
        if ($scope.file != null) {
            console.log($scope.file);
            UploadService.handleFile($scope.file).then(function (data) {
                fileData = data;
                console.log(data);
                fileData.forEach(function (collection) {

                    var name = collection.fileName;
                    if (name === undefined || name === null) {
                        name = "1234"
                    }
                    // Add a layer for each

                });
            });
        }


        /*$scope.activeLayers = [];
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
        });
        $scope.log = '';*/

    }]);