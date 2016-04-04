/**
 * Created by AnneSofie on 14.02.2016.
 */

easygis.controller('menuController', ['$scope', 'Upload','$mdBottomSheet','$mdSidenav', '$mdDialog', 'leafletData', function($scope, Upload,$mdBottomSheet, $mdSidenav, $mdDialog, leafletData){

    // Toolbar search toggle
    $scope.toggleSearch = function(element) {
        $scope.showSearch = !$scope.showSearch;
    };
    // Sidenav toggle
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };


    $scope.addtype = '';
    $scope.savedItems = [];

    $scope.admin = [
        {
            link : '',
            title: 'Trash',
            icon: 'action:ic_delete_24px'
        },
        {
            link : 'showListBottomSheet($event)',
            title: 'Settings',
            icon: 'action:ic_settings_24px'
        }
    ];

    // **  Map

    // -- Leaflet Draw
    var drawnItems = new L.FeatureGroup();
    for (var i = 0; i < $scope.savedItems.length; i++) {
        L.geoJson($scope.savedItems[i].geoJSON, {
            style: function(feature) {
                return {
                    color: '#bada55'
                };
            },
            onEachFeature: function (feature, layer) {
                drawnItems.addLayer(layer);
            }
        });
    }

    angular.extend($scope, {
        center: {
            autoDiscover:true,
            zoom: 10
        },
        controls: {
            draw: {
                position: 'topright',
                draw: {},
                edit: { featureGroup: drawnItems
                }
            }
        }
    });

    leafletData.getMap().then(function(map) {
        var drawnItems = $scope.controls.draw.edit.featureGroup;
        console.log(drawnItems + ' drawnItems ');

        // Init the map with the saved elements
        var printLayers = function () {
            console.log("After: ");
            map.eachLayer(function (layer) {
                console.log(layer);
            });
        };
        drawnItems.addTo(map);

        map.on('draw:created', function (e) {
            var layer = e.layer, type = e.layerType;
            drawnItems.addLayer(layer);

            var geoJSON = layer.toGeoJSON();
            if (type === "circle") {
                var radius = layer.getRadius();
                geoJSON.properties.radius = radius;
                geoJSON.geometry.type = 'Circle';
            }
            $scope.savedItems.push({
                id: layer._leaflet_id,
                geoJSON: geoJSON
            });
            printLayers();
        });
        map.on('draw:edited', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {

                for (var i = 0; i < $scope.savedItems.length; i++) {
                    if ($scope.savedItems[i].id == layer._leaflet_id) {
                        $scope.savedItems[i].geoJSON = layer.toGeoJSON();
                    }
                }
            });
        });

        map.on('draw:deleted', function (e) {
            var layers = e.layers;
            layers.eachLayer(function (layer) {
                for (var i = 0; i < $scope.savedItems.length; i++) {
                    if ($scope.savedItems[i].id == layer._leaflet_id) {
                        $scope.savedItems.splice(i, 1);
                    }
                }
            });
            printLayers();
        });
    });

    $scope.layer = null;
    $scope.layers = null;
    $scope.loadLayers = function() {
        return  $scope.layers = $scope.layers || [ { id:2, name: 'Pub'}, { id: 3, name: 'Birkebeinerroute'}, {id:4, name: 'Restaurants'}, {id: 5, name: 'Innbyggertall'}, {id: 5, name: 'Trafikkmengde'}];
    };

    // -- CartoDB layer
    var cartodbLayer = [];

    $scope.getLayerInfo = function() {
        var name, table, sqlCDB, cssCDB;
        console.log($scope.layer);
        name = $scope.layer.name;
        var layerData = getLayerData(name, 0, 0);
        $scope.loadCartoDBLayer(layerData);
    };
    $scope.createBufferLayer = function(dist, layername) {
        var layerData = getLayerData(layername, dist, 1);
        $scope.loadCartoDBLayer(layerData);
    };
    $scope.calculateDistance = function() {

    };
    $scope.loadCartoDBLayer = function(layerData) {
        console.log(layerData);
        leafletData.getMap().then(function(map) {
            cartodb.Tiles.getTiles(layerData, function(tilesUrl, err) {
                if (tilesUrl === null) {
                    console.log(tilesUrl);
                    console.log('error: ' + err.errors.join('/n'));
                    return;
                }
                if (cartodbLayer) {
                    map.removeLayer(cartodbLayer);
                }
                cartodbLayer = L.tileLayer(tilesUrl.tiles[0]);
                cartodbLayer.addTo(map);
                window.alert('layer added to map');
            });
        });

    };


    var getLayerData = function(name, dist, type) {
        var table = null;
        var cssCDB = null;
        switch (name) {
            case 'Pub':
                table = 'pub_norway';
                cssCDB = '#' + table + '{polygon-fill: #F11810; marker-fill: #229A00; }';
                break;
            case 'Birkebeinerroute':
                table = 'birkebeinerloypen';
                cssCDB = '#' + table + '{line-color: #FF6600; polygon-fill: #A53ED5;}';
                break;
            case 'Restaurants':
                table = 'restaurants_trondheim';
                cssCDB = '#' + table + '{marker-fill: #F11810; polygon-fill: #A53ED5;}';
                break;
            case 'Innbyggertall':
                table = 'innbyggertall_postnr';
                cssCDB = '#' + table + '{marker-fill: #F11810; polygon-fill: #A53ED5;}';
                break;
            case 'Trafikkmengde':
                table = 'trafikkmengde2015';
                cssCDB = '#' + table + '{line-color: #F11810; polygon-fill: #A53ED5;}';
                break;
        }
        var sql = null;

        if (type == 0) {
            sql = getSQL_(table); //Returns the normal sql statement
        } else if (type == 1) {
            sql = getSQL_buffer(table, dist);
            cssCDB = changeCSS_polygon(table);
        }
        var layerData = {
            user_name: 'anneri',
            sublayers: [{
                name: name,
                sql: sql,
                cartocss: cssCDB
            }]
        };
        return layerData;
    };
    var getSQL_ = function(table) {
        var sql_cdb = 'SELECT * FROM ' + table;
        return sql_cdb;
    };
    var getSQL_buffer = function(table, dist) {
        var sql_cdb = 'SELECT ST_Transform(ST_Buffer(the_geom::geography, ' +
            dist + ')::geometry, 3857) as the_geom_webmercator, cartodb_id FROM ' + table;
        return sql_cdb;
    };
    var changeCSS_polygon = function(table) {
        var css_cdb = '#' + table + '{polygon-fill: #A53ED5;}';
        return css_cdb;
    };
    var getSQL_distance = function(table) {

    };


    // Bottomsheet & Modal Dialogs
    $scope.alert = '';
    $scope.showListBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            template: '<md-bottom-sheet class="md-list md-has-header"><md-list><md-list-item class="md-2-line" ng-repeat="item in items" role="link" md-ink-ripple><md-icon md-svg-icon="{{item.icon}}" aria-label="{{item.name}}"></md-icon><div class="md-list-item-text"><h3>{{item.name}}</h3></div></md-list-item> </md-list></md-bottom-sheet>',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $scope.showAdd = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/fileupload.tmpl.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    };

    $scope.showBufferWindow = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="buffer"><h3>Buffer settings</h3><div layout layout-sm="column"> <md-select placeholder="Choose layer" ng-model="layer" md-on-open=""> <md-option ng-value="layer" ng-repeat="layer in layers">{{layer.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary"> Execute buffer </md-button> </div></md-dialog>',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                console.log(answer[0] + ' 0 and 1 ' + answer[1]);
                $scope.alert = 'You said the information was "' + answer + '".';
                $scope.createBufferLayer(answer[0], answer[1]);
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    }
    $scope.showIntersectionWindow = function(ev) {
        $mdDialog.show({
                controller: DialogController_int,
                template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="intersect"> <h3>Intersection settings</h3> <div layout layout-sm="column"><br><md-select placeholder="Choose layer" ng-model="layer_1" md-on-open="" style="margin-right: 5%;"> <md-option ng-value="layer_1" ng-repeat="layer_1 in layers">{{layer_1.name}}</md-option> </md-select><md-select placeholder="Choose layer" ng-model="layer_2" md-on-open=""> <md-option ng-value="layer_2" ng-repeat="layer_2 in layers">{{layer_2.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary">Find intersection</md-button> </div></md-dialog>',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                console.log(answer[0] + ' 0 and 1 ' + answer[1]);
                $scope.alert = 'You said the information was "' + answer + '".';

            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    }
    $scope.showContainsWindow = function(ev) {
        $mdDialog.show({
                controller: DialogController_cont,
                template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="intersect"> <h3>Intersection settings</h3> <div layout layout-sm="column"><br><md-select placeholder="Choose layer" ng-model="layer_1" md-on-open="" style="margin-right: 5%;"> <md-option ng-value="layer_1" ng-repeat="layer_1 in layers">{{layer_1.name}}</md-option> </md-select><md-select placeholder="Choose layer" ng-model="layer_2" md-on-open=""> <md-option ng-value="layer_2" ng-repeat="layer_2 in layers">{{layer_2.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary">Find intersection</md-button> </div></md-dialog>',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function(answer) {
                console.log(answer[0] + ' 0 and 1 ' + answer[1]);
                $scope.alert = 'You said the information was "' + answer + '".';

            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    }
}]);

easygis.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [
        { name: 'Share', icon: 'social:ic_share_24px' },
        { name: 'Upload', icon: 'file:ic_cloud_upload_24px' },
        { name: 'Copy', icon: 'content:ic_content_copy_24px' },
        { name: 'Print this page', icon: 'action:ic_print_24px' },
    ];

    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
});

function DialogController($scope, $mdDialog) {
    $scope.bufferdist = null;
    $scope.layer = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        var dist = $scope.bufferdist;
        var layerName = $scope.layer.name;
        var bufferInfo = [dist, layerName];
        $mdDialog.hide(bufferInfo);
    };

    $scope.layers = $scope.layers || [ { id:2, name: 'Pub'}, { id: 3, name: 'Birkebeinerroute'}, {id:4, name: 'Restaurants'}, {id: 5, name: 'Innbyggertall'}, {id: 5, name: 'Trafikkmengde'}];
}
function DialogController_int($scope, $mdDialog) {
    $scope.layer_1 = null;
    $scope.layer_2 = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        var layerName = $scope.layer.name;
        var bufferInfo = [layerName];
        $mdDialog.hide(bufferInfo);
    };
    $scope.layers = $scope.layers || [ { id:2, name: 'Pub'}, { id: 3, name: 'Birkebeinerroute'}, {id:4, name: 'Restaurants'}, {id: 5, name: 'Innbyggertall'}, {id: 5, name: 'Trafikkmengde'}];
}
function DialogController_cont($scope, $mdDialog) {
    $scope.layer_polygon = null;
    $scope.layer_points = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        var dist = $scope.bufferdist;
        var layerName = $scope.layer.name;
        var bufferInfo = [dist, layerName];
        $mdDialog.hide(bufferInfo);
    };
    $scope.layers = $scope.layers || [ { id:2, name: 'Pub'}, { id: 3, name: 'Birkebeinerroute'}, {id:4, name: 'Restaurants'}, {id: 5, name: 'Innbyggertall'}, {id: 5, name: 'Trafikkmengde'}];
}





