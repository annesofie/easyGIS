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
            map.eachLayer(function(layer) {
                console.log(layer);
            });
        };
        drawnItems.addTo(map);

        map.on('draw:created', function(e) {
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
        map.on('draw:edited', function(e) {
            var layers = e.layers;
            layers.eachLayer(function(layer) {

                for (var i = 0; i < $scope.savedItems.length; i++) {
                    if ($scope.savedItems[i].id == layer._leaflet_id) {
                        $scope.savedItems[i].geoJSON = layer.toGeoJSON();
                    }
                }
            });
        });

        map.on('draw:deleted', function(e) {
            var layers = e.layers;
            layers.eachLayer(function(layer) {
                for (var i = 0; i < $scope.savedItems.length; i++) {
                    if ($scope.savedItems[i].id == layer._leaflet_id) {
                        $scope.savedItems.splice(i, 1);
                    }
                }
            });
            printLayers();
        });

        $scope.layer = null;
        $scope.layers = null;
        $scope.loadLayers = function() {
            return  $scope.layers = $scope.layers || [{ id:1, name: 'Pub'}, { id:2, name: 'Roads'}, { id: 3, name: 'Birkebeinerroute'}, {id:0, name: 'Clean'}];
        };

        // -- CartoDB layer
        var cartodbLayer = [];

        $scope.getLayerInfo = function() {
            var name, table, sqlCDB, cssCDB;
            console.log($scope.layer);
            name = $scope.layer.name;
            switch (name) {
                case 'Pub':
                    table = 'num_pubs_kvm_kommune';
                    sqlCDB = 'SELECT * FROM ' + table;
                    cssCDB = '#num_pubs_kvm_kommune {polygon-fill: #FF6600; }';
                    break;
                case 'Roads':
                    table = 'pub_in_norway';
                    sqlCDB = 'SELECT * FROM ' + table;
                    cssCDB = '#' + table + '{marker-fill: #FF6600; }';
                    break;
                case 'Birkebeinerroute':
                    table = 'birkebeinerloypen';
                    sqlCDB = 'SELECT * FROM ' + table;
                    cssCDB = '#' + table + '{line-color: #FF6600; }';
                    break;

            }
            var layerData = {
                user_name: 'anneri',
                sublayers: [{
                    name: name,
                    sql: sqlCDB,
                    cartocss: cssCDB
                }]
            };
            $scope.loadCartoDBLayer(layerData);
        };

        $scope.createBufferLayer = function(dist, layername) {
            var name, table, sqlCDB, cssCDB;
            name = layername;

            switch (name) {
                case 'Pub':
                    table = 'num_pubs_kvm_kommune';
                    cssCDB = '#num_pubs_kvm_kommune {polygon-fill: #FF6600; }';
                    break;
                case 'Roads':
                    table = 'pub_in_norway';
                    cssCDB = '#' + table + '{marker-fill: #FF6600; }';
                    break;
                case 'Birkebeinerroute':
                    table = 'birkebeinerloypen';
                    cssCDB = '#' + table + '{polygon-fill: #2167AB; }';
                    break;
                case 'Restaurants':
                    table: 'restaurants_trondheim';
                    cssCDB: '#' + table + '{polygon-fill: #F11810; }';
                    break;
            }
            sqlCDB = 'SELECT ST_Buffer(the_geom_webmercator, ' + dist + ') As the_geom_webmercator, cartodb_id FROM ' + table;
            var layerData = {
                user_name: 'anneri',
                sublayers: [{
                    name: name,
                    sql: sqlCDB,
                    cartocss: cssCDB
                }]
            };
            $scope.loadCartoDBLayer(layerData);
        };

        $scope.loadCartoDBLayer = function(layerData) {

            leafletData.getMap().then(function(map) {

                cartodb.Tiles.getTiles(layerData, function(tilesUrl, err) {
                    if (tilesUrl == null) {
                        console.log('error' + err.errors.join('/n'));
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

    });


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

    $scope.showBuffer = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="buffer"> <div layout layout-sm="column"> <md-select placeholder="Choose layer" ng-model="layer" md-on-open=""> <md-option ng-value="layer" ng-repeat="layer in layers">{{layer.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary"> Execute buffer </md-button> </div></md-dialog>',
                targetEvent: ev,
                clickOutsideToClose: false
            })
            .then(function(answer) {
                console.log(answer[0] + ' 0 and 1 ' + answer[1]);
                $scope.alert = 'You said the information was "' + answer + '".';
                $scope.createBufferLayer(answer[0], answer[1]);
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

function DialogController($scope, $mdDialog, Upload) {
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
    $scope.layers = $scope.layers || [{ id:1, name: 'Pub'}, { id:2, name: 'Roads'}, { id: 3, name: 'Birkebeinerroute'}, { id:4, name: 'Restaurants'}];
};





