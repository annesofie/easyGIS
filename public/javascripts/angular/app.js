/**
 * Created by AnneSofie on 13.02.2016.
 */

var easygis = angular.module("easygis", ['ngRoute']);


easygis.config(function($routeProvider) {

    $routeProvider
        .when('/',

            {
                controller: 'mapController',
                templateUrl: 'views/frontpage.html'
            })
        .when('/info',
            {
                controller: 'infoController',
                templateUrl: 'views/infowindow.html'

            })
        .otherwise({ redirectTo: '/'});

});