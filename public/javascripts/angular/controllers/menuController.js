/**
 * Created by AnneSofie on 14.02.2016.
 */

easygis.controller('menuController', ['$scope', '$timeout', '$mdBottomSheet', '$mdSidenav', '$mdDialog', 'leafletData', 'polygonLayerService', 'pointLayerService', 'lineLayerService', 'geoJsonService',
    function ($scope, $timeout, $mdBottomSheet, $mdSidenav, $mdDialog, leafletData, polygonLayerService, pointLayerService, lineLayerService, geoJsonService) {

        // Toolbar search toggle
        $scope.toggleSearch = function (element) {
            $scope.showSearch = !$scope.showSearch;
        };
        // Sidenav toggle
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };

        $scope.addtype = '';
        $scope.savedItems = [];

        //Loading icon show or not show
        $scope.loading = false;

        // ** Get layers available in database
        $scope.layer = null;
        $scope.layers = [];
        $scope.loadLayers = function () {
            return $timeout(function () {
                getPointLayers(pointLayerService, $scope.layers);
                getLineLayers(lineLayerService, $scope.layers);
                getPolygonLayers(polygonLayerService, $scope.layers);
            }, 500);
        };

        // **  Map

        // -- Leaflet Draw
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
                zoom: 10
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

        // -- CartoDB layers active on the map
        $scope.cartodbLayer = null;
        $scope.cartodbLayers = [];

        $scope.getLayerInfo = function (layer) {
            console.log(' getlayerinfo: ' + $scope.layer + ' = layer ');
            var name = layer.name;
            var layerData = null;
            var haveUrl = false;
            for (var i = 0; i < $scope.layers.length; i++) {
                if ($scope.layers[i].name === name) {
                    if ($scope.layers[i].tileURL !== 'nothing') {
                        $scope.addTileURL($scope.layers[i].tileURL, name);
                        haveUrl = true;
                        break;
                    } else {
                        layerData = getLayerData($scope.layers[i].name, $scope.layers[i].dist, null, $scope.layers[i].tileURL,
                            $scope.layers[i].datatype, $scope.layers[i].tablename, 'normal');
                        break;
                    }
                }
            }
            if (!haveUrl && layerData) {
                $scope.loadCartoDBLayer(layerData, name);
            } else {
                console.log('Added with url: ' + haveUrl + ', layerdata is null');
            }
        };
        $scope.addTileURL = function (tileurl, name) {
            if (activeLayersService.checkIfActiveLayer(name)) {
                //Layer already in active layers
                $scope.loading = false;
                $scope.showLayerAlreadyInMapWindow();
            } else {

                activeLayersService.addLayer(name, tileurl);
                leafletData.getMap().then(function (map) {
                    L.tileLayer(tileurl).addTo(map);
                });
                $scope.loading = false;
                $scope.showSuccessWindow();
            }
        };

        function addLayer(show) {
            return function (layer) {
                if (!show) {
                    layer.hide();
                }
                cartodbLayers[id] = layer;
            };
        }
        $scope.loadCartoDBLayer = function (layerData, name) {

            leafletData.getMap().then(function (map) {
                $scope.loading = true;
                geoJsonService.getgeojson('https://anneri.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM pub_norway ')
                    .then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(response);
                        var features = response.data.features;
                        console.log(features);
                        var geolay = L.geoJson(features, {
                            style: {
                                "opacity": 1,
                                "color": '#' + Math.floor(Math.random() * 16777215).toString(16)
                            }
                        });
                        //geolay.on('click', highlightFeature);
                        geolay.addTo(map);

                        //Stop loading icon, show success window
                        $scope.loading = false;
                        $scope.showSuccessWindow();

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('failed to load geojson');
                        $scope.loading = false;

                    });
            });


                /*cartodb.Tiles.getTiles(layerData, function (tilesUrl, err) {
                    if (tilesUrl === null) {
                        console.log(tilesUrl);
                        console.log('error: ' + err.errors.join('/n'));
                        return;
                    }
                    if ($scope.cartodbLayers.indexOf() > 0) {  //Check if layer already in the map
                        $scope.loading = false;
                        $scope.showLayerAlreadyInMapWindow();
                    } else {
                        console.log(JSON.stringify(tilesUrl) + ' = tilesURL');
                        var newLayer = L.tileLayer(tilesUrl.tiles[0], {id: name});
                        console.log(JSON.stringify(newLayer) + ' new layer');
                        $scope.cartodbLayers.push(newLayer);
                        newLayer.addTo(map);  //Add to map

                        //Stop loading icon, show success window
                        $scope.loading = false;
                        $scope.showSuccessWindow();
                    }

                });*/

        };

        $scope.createBufferLayer = function (name, dist, tileURL, tablename) {
            var datatype = 'Polygon';
            console.log('createBufferLayer: name = ' + name + ' dist = ' + dist + ' tileURL = ' + tileURL + ' tablename = ' + tablename);
            var layerData = getLayerData(name, dist, null, tileURL, datatype, tablename, 'buffer');
            $scope.loadBufferLayer(layerData, name, dist, tablename);
        };


        $scope.loadBufferLayer = function (layerData, name, dist, tablename) {
            $scope.loading = true;
            leafletData.getMap().then(function (map) {
                cartodb.Tiles.getTiles(layerData, function (tilesUrl, err) {
                    if (tilesUrl === null) {
                        console.log('error: ' + err.errors.join('/n'));
                        $scope.loading = false;
                        console.log('bufferlayer failed');
                    } else {
                        var buffname = '' + name + ' buffer ' + dist + ' m'; // Name for the new buffer layer
                        var bufflayer = L.tileLayer(tilesUrl.tiles[0], {id: buffname});
                        addPolygonLayer(buffname, dist, tilesUrl.tiles[0], tablename); //Add layer to the database
                        $scope.cartodbLayers.push(bufflayer);
                        bufflayer.addTo(map);

                        //Stop loading icon, show success window
                        $scope.loading = false;
                        $scope.showSuccessWindow();
                    }
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
            leafletData.getMap().then(function (map) {
                cartodb.Tiles.getTiles(layerData, function (tilesUrl, err) {
                    if (tilesUrl === null) {
                        console.log('error: ' + err.errors.join('/n'));
                        $scope.loading = false;
                    } else {
                        var intersecname = '' + name + ' within ' + intername + '';  //Name of the new intersection layer

                        var intersectionLayer = L.tileLayer(tilesUrl.tiles[0], {id: intersecname});
                        $scope.cartodbLayers.push(intersectionLayer);
                        intersectionLayer.addTo(map);

                        addLayerToDB(intersecname, tilesUrl.tiles[0], datatype, tablename);

                        //Hide loading icon, show success window
                        $scope.loading = false;
                        $scope.showSuccessWindow();
                    }
                });
            });
        };

        //Remove layer from map
        $scope.removeLayerFromMap = function (layer) {
            leafletData.getMap().then(function (map) {
                map.removeLayer(layer);
                var i = $scope.cartodbLayers.indexOf(layer);
                $scope.cartodbLayers.splice(i, 1); // Remove layer from cartodbLayers list
                console.log($scope.cartodbLayers);
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
        var getLayerData = function (name, param, dist, tileURL, datatype, tablename, sqltype) {
            console.log(datatype + ' = datatype');
            console.log(tablename + ' = tablename' + dist + ' = dist ' + param + ' = param ');

            var cssCDB = getCSS(tablename, datatype);
            var sql = null;

            if (sqltype === 'normal') {
                sql = getSQL_(tablename); //Returns the normal sql statement
            } else if (sqltype === 'buffer') {
                sql = getSQL_buffer(tablename, param);
                cssCDB = changeCSS(tablename, datatype);
            } else if (sqltype === 'inter_city') {
                sql = getSQL_intersection_within_city(tablename, param);
                cssCDB = changeCSS(tablename, datatype);
            } else if (sqltype === 'inter_buff'){
                sql = getSQL_intersection_within_buffer(tablename, param, dist);
                cssCDB = changeCSS(tablename, datatype);
            }
            console.log(sql + ' = sql ');
            var layerData = {
                user_name: 'anneri',
                type: 'cartodb',
                sublayers: [
                    {
                        //name: name,
                        sql: sql,
                        cartocss: cssCDB
                    }]
            };
            return layerData;
        };
        var getCSS = function (table, type) {
            var cartocss;
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            if (type === 'Point') {
                cartocss = '#' + table + '{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:0.2;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:9;marker-fill:' + color + ' ;marker-allow-overlap:true}';
            } else if (type === 'Line') {
                cartocss = '#' + table + '{line-color:' + color + ';line-width:2;line-opacity:1}';
            } else if (type === 'Polygon') {
                cartocss = '#' + table + '{polygon-fill:' + color + ';polygon-opacity:.7;line-color:#FFF;line-width:.2;line-opacity:.7}';
            }
            return cartocss;
        };
        var changeCSS = function (table, type) {
            var cartocss;
            if (type === 'Point') {
                cartocss = '#' + table + '{marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:0.2;marker-line-opacity:1;marker-placement:point;marker-type:ellipse;marker-width:9;marker-fill: #' + Math.floor(Math.random() * 16777215).toString(16) + ';marker-allow-overlap:true}';
            } else if (type === 'Line') {
                cartocss = '#' + table + '{line-color: #' + Math.floor(Math.random() * 16777215).toString(16) + ';line-width:2;line-opacity:1}';
            } else if (type === 'Polygon') {
                cartocss = '#' + table + '{polygon-fill: #' + Math.floor(Math.random() * 16777215).toString(16) + ';polygon-opacity:.7;line-color:#FFF;line-width:.2;line-opacity:.7}';
            }
            return cartocss;
        };
        var getSQL_ = function (table) {
            var sql_cdb = 'SELECT * FROM ' + table;
            return sql_cdb;
        };
        var getSQL_buffer = function (table, dist) {
            var sql_cdb = 'SELECT ST_Transform(ST_Buffer(the_geom::geography, ' +
                dist + ')::geometry, 3857) as the_geom_webmercator, cartodb_id FROM ' + table;
            return sql_cdb;
        };
        var getSQL_intersection_within_city = function (table, town) {
            var sql_cdb = "SELECT " + table + ".cartodb_id, " + table + ".the_geom_webmercator, k.navn FROM " + table + ", kommuner as k WHERE st_intersects(" + table + ".the_geom, k.the_geom) and k.navn='" + town + "'";
            return sql_cdb;
        };
        var getSQL_intersection_within_buffer = function(table_lay, table_buff, dist) {
            var sql_cdb = "SELECT "+table_lay+".cartodb_id, "+table_lay+".the_geom, "+table_lay+".the_geom_webmercator FROM "+table_lay+", "+table_buff+" WHERE ST_DWithin("+table_lay+".the_geom_webmercator, "+table_buff+".the_geom_webmercator, "+dist+")";
            return sql_cdb;
        };
        var getSQL_distance = function (table) {

        };

        // ** Help functions to get/add layers from/to database

        function addLayerToDB(name, tileurl, datatype, tablename){
            if (datatype === 'Polygon') {
                console.log('adds polygonlayer');
                addPolygonLayer(name, 0, tileurl, tablename);
            } else if (datatype === 'Line') {
                console.log('adds linelayer');
                addLineLayer(name, tileurl, tablename);
            } else if (datatype === 'Point') {
                console.log('adds pointlayer');
                addPointLayer(name, tileurl, tablename);
            }
        }

        function getPointLayers(pointLayerService, layers) {
            pointLayerService.getPointLayers().then(function (response) {
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        var layer = {
                            name: response.data[key].name,
                            tileURL: response.data[key].tileURL,
                            datatype: 'Point',
                            tablename: response.data[key].tablename
                        };

                    }
                    if ($scope.layers.indexOf(layer) == -1) {
                        layers.push(layer);
                    }
                }
            }, function (response) {
                console.log(response + ', failed to load points');
                //Error
            });
        }

        function getLineLayers(lineLayerService, layers) {
            lineLayerService.getLineLayers().then(function (response) {
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        var layer = {
                            name: response.data[key].name,
                            tileURL: response.data[key].tileURL,
                            datatype: 'Line',
                            tablename: response.data[key].tablename
                        };
                    }
                    if ($scope.layers.indexOf(layer) == -1) {
                        layers.push(layer);
                    }
                }
            }, function (response) {
                console.log(response + ', failed to load lines');
                //Error
            });
        }

        function getPolygonLayers(polygonLayerService, layers) {
            polygonLayerService.getPolyLayers().then(function (response) {
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        var layer = {
                            name: response.data[key].name,
                            dist: response.data[key].dist,
                            tileURL: response.data[key].tileURL,
                            datatype: 'Polygon',
                            tablename: response.data[key].tablename
                        };
                    }
                    if ($scope.layers.indexOf(layer) == -1) {
                        layers.push(layer);
                    }
                }
            }, function (response) {
                console.log(response + ', failed to load polygons');
                //Error
            });
        }

        function addPolygonLayer(name, dist, tileurl, tablename) {
            polygonLayerService.addpolygonlayer(name, dist, tileurl, tablename)
                .then(function (response) {
                    if (response.status === 200) {
                        console.log('Polygonlayer ble lagt til');
                    }
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
        }

        function addLineLayer(name, tileurl, tablename) {
            lineLayerService.addLineLayer(name, tileurl, tablename)
                .then(function (response) {
                    if (response.status === 200) {
                        console.log('Linelayer ble lagt til');
                    }
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
        }

        function addPointLayer(name, tileurl, tablename) {
            pointLayerService.addPointLayer(name, tileurl, tablename)
                .then(function (response) {
                    if (response.status === 200) {
                        console.log('Linelayer ble lagt til');
                    }
                }, function () {
                    console.log('adding failed');
                    $scope.loading = false;
                });
        }

        // ** Left menu, open new window:

        $scope.showBufferWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogControllerBuff,
                    template: '<md-dialog aria-label="Form"><md-content class="md-padding"><form name="buffer"><h3>Buffer settings</h3><div layout layout-sm="column"> <md-select placeholder="Choose layer" ng-model="layer" md-on-open=""><md-option ng-value="layer" ng-repeat="layer in layers"><a>{{layer.name}}</a></md-option> </md-select></md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="bufferdist"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary"> Execute buffer </md-button> </div></md-dialog>',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $scope.createBufferLayer(answer[0], answer[1], answer[2], answer[3]);
                }, function () {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
        $scope.showIntersectionWindow = function (ev) {
            $mdDialog.show({
                    controller: DialogController_int,
                    templateUrl: 'views/intersection.tmpl.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $scope.createIntersectionLayer(answer.name, answer.datatype, answer.tablename, answer.intervar, answer.intername, answer.buffdist, answer.sqltype);
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
                    template: '<md-dialog aria-label="Form"><md-content class="md-padding"><form name="buffer"><h3>Remove layer from map</h3><div layout layout-sm="column"> <md-select placeholder="Choose layer" ng-model="activelayer" md-on-open=""> <md-option ng-value="activelayer" ng-repeat="activelayer in activelayers">{{activelayer.options.id}}</md-option> </md-select></md-menu> </div><div layout layout-sm="column"><div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(hei)" class="md-primary">Remove Layer</md-button> </div></md-dialog>',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        layers: $scope.cartodbLayers
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






