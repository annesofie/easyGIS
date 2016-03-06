/**
 * Created by AnneSofie on 14.02.2016.
 */

easygis.controller('menuController', ['$scope', '$mdBottomSheet','$mdSidenav', '$mdDialog', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog){

        // Toolbar search toggle
        $scope.toggleSearch = function(element) {
            $scope.showSearch = !$scope.showSearch;
        };

        // Sidenav toggle
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        // Menu items'
        $scope.menu = [
            {
                link : '',
                title: 'Add Point',
                icon: 'communication:ic_location_on_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
            },
            {
                link : '',
                title: 'Add Line',
                icon: 'content:ic_remove_24px'
            },
            {
                link : '',
                title: 'Add Polygon',
                icon: 'image:ic_crop_square_24px'
            },
            {
                link : '',
                title: 'Buffer',
                icon: 'av:ic_album_24px'
            }
        ];
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

        //Map
        angular.extend($scope, {
            center: {
                autoDiscover:true,
                zoom: 10
            }
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
                    template: '<md-dialog aria-label="Form"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="user.lastName"> </md-input-container> </div> <md-input-container flex> <label>Message</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
                    targetEvent: ev,
                })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
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

    easygis.config(function($mdThemingProvider) {
        var customGreenMap = 		$mdThemingProvider.extendPalette('green', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50']
            //'50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customGreen', customGreenMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customGreen', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    });

    easygis.config(function($mdIconProvider) {
        $mdIconProvider
        // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
        //
            .iconSet('action', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24)
            .iconSet('alert', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-alert.svg', 24)
            .iconSet('av', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-av.svg', 24)
            .iconSet('communication', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-communication.svg', 24)
            .iconSet('content', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-content.svg', 24)
            .iconSet('device', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-device.svg', 24)
            .iconSet('editor', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-editor.svg', 24)
            .iconSet('file', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-file.svg', 24)
            .iconSet('hardware', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
            .iconSet('image', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-image.svg', 24)
            .iconSet('maps', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-maps.svg', 24)
            .iconSet('navigation', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
            .iconSet('notification', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-notification.svg', 24)
            .iconSet('social', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-social.svg', 24)
            .iconSet('toggle', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-toggle.svg', 24)

            // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
            .iconSet('avatars', 'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg', 24)
            .defaultIconSet('https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24);
    });


