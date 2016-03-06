/**
 * Created by AnneSofie on 13.02.2016.
 */

var easygis = angular.module("easygis", ['ngMaterial', 'ngMessages', 'ngRoute', 'ngFileUpload', 'leaflet-directive']);

easygis.config(function($routeProvider) {

    $routeProvider
        .when('/',

            {
                controller: 'menuController',
                templateUrl: 'views/map_frontpage.html'
            })
        .when('/info',
            {
                controller: 'infoController',
                templateUrl: 'views/infowindow.html'

            })
        .when('/back',{
            controller: 'mapController',
            templateUrl: 'views/frontpage.html'
        })
        .when('/menu', {
            controller: 'mapController',
            templateUrl: 'views/menu.html'
        })
        .otherwise({ redirectTo: '/'});

});