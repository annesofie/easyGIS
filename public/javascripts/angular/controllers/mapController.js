/**
 * Created by AnneSofie on 13.02.2016.
 */

easygis.controller('mapController', ['$scope', '$timeout', function ($scope, $timeout, fileHandler) {

    $scope.map = init();

    $scope.interactionTypes = ['None', 'Point', 'LineString', 'Polygon', 'Circle', 'Square', 'Box'];
    $scope.interactionType = 'None';

    $scope.show = {
        slider: false,
        interactionTypes: false
    };

    //functions

    $scope.toggleSlider = function () {
        $scope.show.slider = (!$scope.show.slider);
        $timeout(function () {
            $scope.map.updateSize();
        }, 300);
    };

    $scope.toggle = function(type) {
        $scope.show[type] = $scope.show[type] ? false : true;
    };

    $scope.$watch('interactionType', function(){
        $scope.addInteraction()
    });

    $scope.addInteraction = function addInteraction() {
        $scope.interactionType;
        console.log($scope.interactionType);
        $scope.show.interactionTypes = false;
        $scope.draw;

        var value = $scope.interactionType;

        if (value !== 'None') {
            var geometryFunction, maxPoints;
            if (value === 'Square') {
                value = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (value === 'Box') {
                value = 'LineString';
                maxPoints = 2;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                        [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                };
            }
            //If already a draw is defined remove it first.
            if($scope.draw){
                $scope.map.removeInteraction($scope.draw);
            }

            $scope.draw = new ol.interaction.Draw({
                source: $scope.drawSource,
                type: /** @type {ol.geom.GeometryType} */ (value),
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            });
            $scope.map.addInteraction($scope.draw);
            //When finished drawing
           // $scope.draw.on('drawend', saveDrawing);
        } else {
            //None is selected, we remove the current selected drawing type
            if($scope.draw){
                $scope.map.removeInteraction($scope.draw);
            }

        }
    };

    $scope.deleteSelected = function deleteSelected() {
        $scope.selectedFeatures.forEach(function (feature) {
            if (vectorSource.getFeatureById(id)) {
                $scope.vectorSource.removeFeature(feature);
            }
            if (drawSource.getFeatureById(id)) {
                $scope.drawSource.removeFeature(feature);
            }
            $scope.selectedFeatures.clear();
        });
    };

    $scope.$watch('file', function() {
        if ($scope.file != null) {
            console.log($scope.file);
            fileHandler.handleFile($scope.file).then(function(data) {
                console.log('inni filehandler');
            })
        }
    });

    function init() {

        $scope.drawSource = new ol.source.Vector({wrapX: false});
        $scope.vectorSource = new ol.source.Vector({wrapX: false});

        //Layer for drawing
        var vector = new ol.layer.Vector({
            source: $scope.drawSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'osm'})
                }),
                vector
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([10.421906, 63.446827]),   //OBS long, lat
                zoom: 7
            })
        });

        return map;
    };



}]);


