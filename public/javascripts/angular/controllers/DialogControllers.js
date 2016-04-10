/**
 * Created by AnneSofie on 10.04.2016.
 */

function DialogControllerBuff($scope, $mdDialog, pointLayerService, lineLayerService) {
    $scope.bufferdist = null;
    $scope.layer = null;
    $scope.layers = [];
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        var dist = $scope.bufferdist;
        var layerName = $scope.layer.name;
        var tileURL = $scope.layer.tileURL;
        var tablename = $scope.layer.tablename;
        var bufferInfo = [layerName, dist, tileURL, tablename];
        $mdDialog.hide(bufferInfo);
    };
    pointLayerService.getPointLayers().then(function (response) {
        for(var key in response.data){
            if(response.data.hasOwnProperty(key)){
                console.log(key);
                $scope.layer = { 'name': response.data[key].name, tileURL: response.data[key].tileURL, tablename: response.data[key].tablename};
                $scope.layers.push($scope.layer);
            }
        }
    }, function (response) {
        //Error
    });
    lineLayerService.getLineLayers().then(function (response) {
        for(var key in response.data){
            if(response.data.hasOwnProperty(key)){
                console.log(key);
                $scope.layer = { 'name': response.data[key].name, tileURL: response.data[key].tileURL, tablename: response.data[key].tablename};
                $scope.layers.push($scope.layer);
            }
        }
    }, function(response) {
        //Error
    });
}
function DialogController_int($scope, $mdDialog, PolygonLayer) {
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
function DialogController_addnewlayer($scope, $mdDialog) {
    $scope.polylayer = {
        name: '',
        tablename: '',
        type: 0
    };
    $scope.layertypes = ['Point', 'Line', 'Polygon'];
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        var name = $scope.polylayer.name;
        var tablename = $scope.polylayer.tablename;
        var type = $scope.polylayer.type;
        console.log(JSON.stringify($scope.polylayer) + ' = input user');
        var answer = [name, type, tablename];
        $mdDialog.hide(answer);
    };
}
function DialogController_success($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.layers = $scope.layers || [ { id:2, name: 'Pub'}, { id: 3, name: 'Birkebeinerroute'}, {id:4, name: 'Restaurants'}, {id: 5, name: 'Innbyggertall'}, {id: 5, name: 'Trafikkmengde'}];
}
