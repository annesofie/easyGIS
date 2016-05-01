/**
 * Created by AnneSofie on 10.04.2016.
 */

function DialogControllerBuff($scope, $mdDialog, layers) {
    $scope.bufferdist = null;
    $scope.layer = null;
    $scope.layers = layers;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $scope.layer.buffdist = $scope.bufferdist;
        $scope.layer.datatype = 'Polygon';
        $scope.layer.newname = $scope.layer.name + ' buff ' + $scope.bufferdist + ' m';
        $scope.layer.newdbname = $scope.layer.name+'_buff_' + $scope.bufferdist + '_m';
        $mdDialog.hide($scope.layer);
    };

}
function DialogController_int($scope, $mdDialog, pointLayerService, lineLayerService, polygonLayerService) {
    $scope.name = null;
    $scope.names = ['Trondheim', 'Bergen', 'Oslo', 'Molde', 'Kristiansand', 'Stavanger', 'Tromsø'];
    $scope.layer = null;
    $scope.layers = [];
    $scope.polygonlayer = null;
    $scope.polygonlayers = [];

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        if($scope.name) {
            $scope.layer.intervar= $scope.name;
            $scope.layer.buffdist = 0;
            $scope.layer.intername = $scope.name;
            $scope.layer.sqltype = 'inter_city';
            console.log(JSON.stringify($scope.layer) + ' input inter_city');
            $mdDialog.hide($scope.layer);

        } else if ($scope.polygonlayer) {
            $scope.layer.intervar = $scope.polygonlayer.tablename;
            $scope.layer.buffdist = $scope.polygonlayer.dist;
            $scope.layer.intername = $scope.polygonlayer.name;
            $scope.layer.sqltype = 'inter_buff';
            console.log(JSON.stringify($scope.layer) + ' input inter_buff');
            $mdDialog.hide($scope.layer);

        }
    };
    getPointLayers(pointLayerService, $scope.layer, $scope.layers);
    getLineLayers(lineLayerService, $scope.layer, $scope.layers);
    getPolygonLayers(polygonLayerService, $scope.polygonlayer, $scope.polygonlayers);
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
function DialogController_removelayer($scope, $mdDialog, layers) {

    $scope.activelayer = null;
    $scope.activelayers = [];
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide($scope.activelayer);
    };
    $scope.activelayers = layers;
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
function DialogController_success($scope, $mdDialog, $timeout) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $timeout($mdDialog.hide, 40);

}

function getPointLayers(pointLayerService, layer, layers) {
    pointLayerService.getPointLayers().then(function (response) {
        for(var key in response.data){
            if(response.data.hasOwnProperty(key)){
                console.log(key);
                layer = { name: response.data[key].name, tileURL: response.data[key].tileURL, datatype: response.data[key].datatype, tablename: response.data[key].tablename};
                layers.push(layer);
            }
        }
    }, function (response) {
        //Error
    });
}
function getLineLayers(lineLayerService, layer, layers){
    lineLayerService.getLineLayers().then(function (response) {
        for(var key in response.data){
            if(response.data.hasOwnProperty(key)){
                console.log(key);
                layer = { name: response.data[key].name, tileURL: response.data[key].tileURL, datatype: response.data[key].datatype, tablename: response.data[key].tablename};
                layers.push(layer);
            }
        }
    }, function(response) {
        //Error
    });
}
function getPolygonLayers(polygonLayerService, layer, layers) {
    polygonLayerService.getPolyLayers().then(function (response) {
        for (var key in response.data) {
            if (response.data.hasOwnProperty(key)) {
                layer = {
                    name: response.data[key].name,
                    dist: response.data[key].dist,
                    tileURL: response.data[key].tileURL,
                    datatype: 'Polygon',
                    tablename: response.data[key].tablename
                };
                //console.log(JSON.stringify(layer) + ' = layer in getPolygonlayer in intersection');
                layers.push(layer);
            }
        }
    }, function (response) {
        console.log(response + ', failed to load polygons');
        //Error
    });
}