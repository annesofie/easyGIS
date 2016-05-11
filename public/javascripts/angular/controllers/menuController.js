/**
 * Created by AnneSofie on 14.02.2016.
 */

easygis.controller('menuController', ['$scope', '$timeout', '$mdBottomSheet', '$mdSidenav', '$mdDialog', 'leafletData', 'polygonLayerService', 'pointLayerService', 'lineLayerService', 'geoJsonService', 'layerService','$http',
    function ($scope, $timeout, $mdBottomSheet, $mdSidenav, $mdDialog, leafletData, polygonLayerService, pointLayerService, lineLayerService, geoJsonService, layerService, $http) {

        // Toolbar search toggle
        $scope.toggleSearch = function (element) {
            $scope.showSearch = !$scope.showSearch;
        };
        // Sidenav toggle
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };

        //Loading icon show or not show
        $scope.loading = false;

        $scope.savedItems = [];

        // -------------------------  Map --------------------------

        $scope.mapBoundsSouthWest = [];
        $scope.mapBoundsNorthEast = [];

        // ** Get layers available in database
        $scope.layer = null;
        $scope.layers = [];
        $scope.loadLayers = function () {
            return $timeout(function () {
                layerService.getLayer('/api/layers/all')
                    .success(function(data) {
                        console.log(data);
                        $scope.layers = data.data;
                    })
                    .error(function(error) {
                    console.log('Error: ' + error);
                });
                /*$scope.layers = [{name:'Restaurant', dbname: 'restaurant', datatype: 'Point'}, {name:'Pub', dbname: 'pub', datatype: 'Point'},
                    {name: 'Kommuner', dbname: 'kommune', datatype: 'Polygon'}, {name: 'Trafikkmengde', dbname: 'trafikkmengde', datatype: 'Line'},
                    {name: 'Restaurant buff 40 m', dbname: 'restaurant_buff_66_m', datatype: 'Polygon'}];*/
            }, 500);
        };



        // ---- Leaflet Draw
        var drawnItems = new L.FeatureGroup();
        for (var i = 0; i < $scope.savedItems.length; i++) {
            L.geoJson($scope.savedItems[i].geoJSON, {
                style: function (feature) {
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
                autoDiscover: true,
                zoom: 12
            },
            defaults: {
                scrollWheelZoom: true
            },
            controls: {
                draw: {
                    position: 'topright',
                    draw: {},
                    edit: {
                        featureGroup: drawnItems
                    }
                }
            }
        });

        leafletData.getMap().then(function (map) {
            $scope.mapBoundsNorthEast = {
                lat: map.getBounds()._northEast.lat,
                long: map.getBounds()._northEast.lng
            };
            $scope.mapBoundsSouthWest = {
                lat: map.getBounds()._southWest.lat,
                long: map.getBounds()._southWest.lng
            };
            console.log($scope.mapBoundsNorthEast);
            console.log($scope.mapBoundsSouthWest);

            var drawnItems = $scope.controls.draw.edit.featureGroup;
            console.log(drawnItems + ' drawnItems ');

            // Init the map with the saved elements
           /* var printLayers = function () {
                console.log("After: ");
                map.eachLayer(function (layer) {
                    console.log(layer);
                });
            };*/
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

        // ----- Map layers active on the map
        $scope.activeLayer = null;
        $scope.activeLayers = []; //Layers on the map
        $scope.expandActiveLayers = false;
        $scope.showEditMenu = false;

        $scope.setExpandLayerBool = function() { //Show list of active layers
            if($scope.expandActiveLayers) {
                $scope.expandActiveLayers = false;
                //$scope.showEditMenu = false;
            } else {
                $scope.expandActiveLayers = true;
            }
        };

        $scope.chosenActiveLayer=null;
        $scope.setEditMenuBool = function(layer) { //Show edit layer menu
            if($scope.chosenActiveLayer){
                $scope.chosenActiveLayer.obj.setStyle({ //Old active layer
                    "opacity": 0.65
                });

            }
            if(layer == 0){
                $scope.showEditMenu = false;
            } else {
                $scope.showEditMenu = true;
                console.log($scope.activeLayer);
                console.log(layer);
                $scope.chosenActiveLayer = layer; //New active layer
                highlightChosenActive(layer.obj);
            }
        };
        function highlightChosenActive(layer){
                layer.setStyle({
                    "opacity": 1
                })
        }

        // Edit layer menu methods
        $scope.hexPicker = {
            color: ''
        };
        $scope.changeLayerColor = function() {
            console.log($scope.activeLayer);
            $scope.chosenActiveLayer.obj.setStyle({
                color: $scope.hexPicker.color,
                fillColor: $scope.hexPicker.color
            })
        };
        $scope.bringToFront = function() {
            $scope.chosenActiveLayer.obj.bringToFront();
        };
        $scope.removeLayer = function () {
            leafletData.getMap().then(function (map) {
                map.removeLayer($scope.chosenActiveLayer.obj);
                var i = $scope.activeLayers.indexOf($scope.chosenActiveLayer);
                $scope.activeLayers.splice(i, 1); // Remove layer from activeLayers list
                console.log($scope.activeLayers);
                $scope.showRemovedSuccessWindow();
            });
        };


        $scope.getLayerInfo = function (layer) {
            var dbname = layer.dbname;
            for (lay in $scope.activeLayers){
                if(lay.hasOwnProperty('name')){
                    if(lay.name == layer.layername){
                        return;
                    }
                }
            }
            $scope.addLayerToMap(dbname, layer.layername, layer.datatype);
        };
        $scope.newBufferLayer = function (layer) {
            console.log(layer);
            $scope.loading = true;
            var newlayer = {newname: layer.newname, dbname: layer.dbname, buffdist: layer.buffdist, newdbname: layer.newdbname};
            var layerinfo = {layername: layer.newname, dbname: layer.newdbname, datatype: layer.datatype};
            console.log(layerinfo);
            layerService.postLayer('/api/layer/buffer/', newlayer)
                .success(function(data) {
                    console.log(' added ');
                    layerService.postLayer('/api/layer/new', layerinfo);
                    $scope.addLayerToMap(layer.newdbname,  layer.newname, 'Polygon');
                })
                .error(function(error) {
                        console.log(error);
                });
        };
        $scope.newIntersectionLayer = function(layer){
            console.log(layer);
            $scope.loading = true;
            var newlayer = {newname: layer.newname, a_dbname: layer.dbname, b_dbname: layer.b_dbname, newdbname: layer.newdbname};
            var layerinfo = {layername: layer.newname, dbname: layer.newdbname, datatype: layer.datatype};
            console.log(newlayer);
            console.log(layerinfo);
            layerService.postLayer('/api/layer/intersection/', newlayer)
                .then(function(response){
                    $scope.loading = false;
                    console.log(' added intersection layer');
                }, function(response) {
                    //error
                    console.log(response);
                });

        };
        $scope.addLayerToMap = function (dbname, name, datatype) {

            var geojsonMarkerOptions = {  //Circles instead of markers on point-layers
                radius: 2,
                fillColor: '#' + Math.floor(Math.random() * 16777215).toString(16),  //Add random color to the layer
                color: "#000",
                weight: 1,
                opacity: 0.65,
                fillOpacity: 0.8
            };
            var myStyle = {
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),  //Add random color to the layer
                fillColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                weight: 6,
                opacity: 0.65
            };
            leafletData.getMap().then(function (map) {
                $scope.loading = true;

                layerService.getLayer('/api/layer/' + dbname)
                    .success(function (data) {
                        console.log(data);
                        var features = data.data[0].row_to_json.features;

                        var geolay = L.geoJson(features, {
                            style: myStyle,
                            pointToLayer: function (feature, latlng) {
                                return L.circleMarker(latlng, geojsonMarkerOptions);
                            },
                            onEachFeature: function (feature, lay) {
                                feature.properties.datatype = datatype;
                                lay.bindPopup(name);
                                if (feature.properties.komm_navn) {
                                    lay.bindPopup(feature.properties.komm_navn);
                                }
                            }
                        });
                        //geolay.on('click', highlightFeature);
                        geolay.addTo(map);
                        console.log(geolay);
                        var activelay = {name: name, obj: geolay};
                        $scope.activeLayers.push(activelay);

                        //Stop loading icon, show success window
                        $scope.loading = false;
                        $scope.showSuccessWindow();

                    })
                    .error(function (error) {
                        console.log('Error: ' + error);
                    });
            });


        };
        $scope.createIntersectionLayer = function (name, datatype, tablename, param, intername, dist, sqltype) {
            console.log('createIntersLayer: name = ' + name + ' town = ' + param + ' tablename = ' + tablename + ' datatype: ' + datatype);
            var layerData = getLayerData(name, param, dist, 'nothing', datatype, tablename, sqltype);
            $scope.loadIntersectionLayer(layerData, name, param, datatype, tablename, intername);
        };
        $scope.loadIntersectionLayer = function (layerData, name, param, datatype, tablename, intername) {
            console.log(datatype + ' = datatype');
            $scope.loading = true;

        };

        //Remove layer from map
        $scope.removeLayerFromMap = function (layer) {
            leafletData.getMap().then(function (map) {
                map.removeLayer(layer);
                var i = $scope.activeLayers.indexOf(layer);
                $scope.activeLayers.splice(i, 1); // Remove layer from activeLayers list
                console.log($scope.activeLayers);
                $scope.showRemovedSuccessWindow();
            });
        };

        // Add new layer inn database
        $scope.addnewlayer = function (name, dist, tileurl, type, dbname) {
            if (type == 'Polygon') {
                $scope.loading = true;
                polygonLayerService.addpolygonlayer(name, dist, tileurl, dbname).then(function (response) {
                    console.log('success, response: ' + JSON.stringify(response));
                    $scope.loading = false;
                    $scope.showSuccessWindow();
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
            } else if (type == 'Point') {
                $scope.loading = true;
                pointLayerService.addPointLayer(name, tileurl, dbname).then(function (response) {
                    console.log('success, response: ' + JSON.stringify(response));
                    $scope.loading = false;
                    $scope.showSuccessWindow();
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
            } else if (type == 'Line') {
                $scope.loading = true;
                lineLayerService.addLineLayer(name, tileurl, dbname).then(function (response) {
                    console.log('success, response: ' + JSON.stringify(response));
                    $scope.loading = false;
                    $scope.showSuccessWindow();
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
            }
        };


        // **  Help functions

        $scope.selectedFeature = null;
        $scope.featureList = [];
        function highlightFeature(e) {
            var layer = e.layer;
            console.log(layer);
            var index = $scope.featureList.indexOf(layer);
            if (index >= 0) {
                $scope.featureList.splice(index, 1);
                layer.setStyle({
                    "opacity": 0.5
                });
                return;
            } else {
                $scope.featureList.push(layer);
                layer.setStyle({
                    "opacity": 1
                });
                return;
            }

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        }

        // ** Help functions to get/add layers from/to database


        // ** Left menu, open new window:

        $scope.showBufferWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogControllerBuff,
                    templateUrl: 'views/buffer.tmpl.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        layers: $scope.layers
                    }
                })
                .then(function (answer) {
                    console.log(answer);
                    $scope.newBufferLayer(answer);
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showIntersectionWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_int,
                    templateUrl: 'views/intersection.tmpl.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        layers: $scope.layers
                    }
                })
                .then(function (answer) {
                    console.log(answer);
                    $scope.newIntersectionLayer(answer);
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showContainsWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_cont,
                    template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="intersect"> <h3>Intersection settings</h3> <div layout layout-sm="column"><br><md-select placeholder="Choose layer" ng-model="layer_1" md-on-open="" style="margin-right: 5%;"> <md-option ng-value="layer_1" ng-repeat="layer_1 in layers">{{layer_1.name}}</md-option> </md-select><md-select placeholder="Choose layer" ng-model="layer_2" md-on-open=""> <md-option ng-value="layer_2" ng-repeat="layer_2 in layers">{{layer_2.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary">Find intersection</md-button> </div></md-dialog>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    console.log(answer[0] + ' 0 and 1 ' + answer[1]);
                    $scope.alert = 'You said the information was "' + answer + '".';

                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.removeLayerWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_removelayer,
                    template: '<md-dialog aria-label="Form"><md-content class="md-padding"><form name="buffer"><h3>Remove layer from map</h3><div layout layout-sm="column"> <md-select placeholder="Choose layer" ng-model="activelayer" md-on-open=""> <md-option ng-value="activelayer" ng-repeat="activelayer in activelayers">{{activelayer.name}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"><div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary">Remove Layer</md-button> </div></md-dialog>',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        layers: $scope.activeLayers
                    }
                })
                .then(function (answer) {
                    $scope.removeLayerFromMap(answer);
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showAddNewLayerToDatabaseWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_addnewlayer,
                    template: '<md-content class="md-no-momentum"><md-input-container md-no-float="" class="md-block"><input ng-model="polylayer.name" type="text" placeholder="Name of dataset"></md-input-container><md-input-container md-no-float="" class="md-block"><input ng-model="polylayer.tablename" type="text" placeholder="Tablename in CartoDB"></md-input-container><md-select placeholder="Choose layertype" ng-model="polylayer.type" md-on-open=""> <md-option ng-value="layer" ng-repeat="layer in layertypes">{{layer}}</md-option> </md-select><div></div><md-button ng-click="cancel()"> Cancel </md-button><md-button ng-click="answer(hei)" class="md-primary">Add to database</md-button></md-content>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    console.log(answer[0] + answer[1] + answer[2]);
                    $scope.addnewlayer(answer[0], 0, 'nothing', answer[1], answer[2]);
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showSuccessWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_success,
                    template: '<md-button ng-click="answer(ok)" class="md-raised md-primary"><md-icon md-svg-src="action:ic_done_24px"></md-icon>Layer was added</md-button></md-content>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    //close windon
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showRemovedSuccessWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_success,
                    template: '<md-button ng-click="answer(ok)" class="md-raised md-primary"><md-icon md-svg-src="action:ic_done_24px"></md-icon>Layer was removed</md-button></md-content>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    console.log('pushed ok');
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showLayerAlreadyInMapWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_success,
                    template: '<md-button ng-click="answer(ok)" class="md-raised"><md-icon md-svg-src="action:ic_info_outline_24px"></md-icon>Layer is already in the map</md-button></md-content>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    console.log('pushed ok');
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };

        // Bottomsheet & Modal Dialogs
        $scope.alert = '';
        $scope.showListBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                template: '<md-bottom-sheet class="md-list md-has-header"><md-list><md-list-item class="md-2-line" ng-repeat="item in items" role="link" md-ink-ripple><md-icon md-svg-icon="{{item.icon}}" aria-label="{{item.name}}"></md-icon><div class="md-list-item-text"><h3>{{item.name}}</h3></div></md-list-item> </md-list></md-bottom-sheet>',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showAdd = function (ev) {
            $mdDialog.show({
                    controller: DialogControllerBuff,
                    templateUrl: 'views/fileupload.tmpl.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
    }]);

easygis.controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet) {
    $scope.items = [
        {name: 'Share', icon: 'social:ic_share_24px'},
        {name: 'Upload', icon: 'file:ic_cloud_upload_24px'},
        {name: 'Copy', icon: 'content:ic_content_copy_24px'},
        {name: 'Print this page', icon: 'action:ic_print_24px'},
    ];

    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
});






