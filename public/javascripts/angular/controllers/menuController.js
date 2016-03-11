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
        });
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
                template: '<md-dialog aria-label="Form"><md-content class="md-padding"> <form name="buffer"> <div layout layout-sm="column"><md-menu-content width="4"> <md-menu-item ng-repeat="item in [1, 2, 3]"> <md-button ng-click="">Option {{ item }}</md-button> </md-menu-item></md-menu-content> </md-menu> </div><div layout layout-sm="column"> <md-input-container flex> <label>Buffer distance [m]</label> <input ng-model="l.name"> </md-input-container> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button id="uploadFileBtn" ng-click="answer()" class="md-primary"> Execute buffer </md-button> </div></md-dialog>',
                targetEvent: ev,
                clickOutsideToClose: false
            })
            .then(function(answer) {
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

function DialogController($scope, $mdDialog, Upload) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
};





