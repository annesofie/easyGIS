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
        $scope.layer.newname = $scope.layer.layername + ' buff ' + $scope.bufferdist + 'm';
        $scope.layer.newdbname = $scope.layer.dbname + '_buff_' + $scope.bufferdist + '_m';
        $mdDialog.hide($scope.layer);
    };

}
function DialogController_int($scope, $mdDialog, layers) {
    $scope.name = null;
    $scope.names = ['Trondheim', 'Bergen', 'Oslo', 'Molde', 'Kristiansand', 'Stavanger', 'Tromsø'];
    $scope.layer = null;
    $scope.layers = layers;
    $scope.polygonlayer = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        if($scope.name) {
            $scope.layer.intervar= $scope.name;
            $scope.layer.intername = $scope.name;
            $scope.layer.sqltype = 'inter_city';
            console.log(JSON.stringify($scope.layer) + ' input inter_city');
            $mdDialog.hide($scope.layer);

        } else if ($scope.polygonlayer) {
            $scope.layer.b_dbname = $scope.polygonlayer.dbname;
            var dist = $scope.polygonlayer.layername.substring($scope.polygonlayer.layername.lastIndexOf(" ")+1);
            var buffname = $scope.polygonlayer.layername.substr(0,$scope.polygonlayer.layername.indexOf(' '));
            $scope.layer.newname = $scope.layer.layername+' within '+dist+' of '+buffname;
            $scope.layer.newdbname = $scope.layer.dbname+'_within_'+dist+buffname;
            $scope.layer.sqltype = 'inter_buff';
            console.log(JSON.stringify($scope.layer) + ' input inter_buff');
            $mdDialog.hide($scope.layer);
        }
    };
}
function DialogController_union($scope, $mdDialog, layers) {
    $scope.layer1 = null;
    $scope.layer2 = null;
    $scope.layers = layers;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        console.log(answer);
        if (answer == 1) {
            $scope.layer1.type = 1;
            $scope.layer1.newname = 'Union ' + $scope.layer1.layername;
            $scope.layer1.newdbname = 'union_'+$scope.layer1.dbname;
            $mdDialog.hide($scope.layer1);
        } else if (answer == 2){
            $scope.layer1.type = 2;
            var name1 = $scope.layer1.layername.substr($scope.layer1.layername.indexOf(' '));
            var name2 = $scope.layer2.layername.substr($scope.layer2.layername.indexOf(' '));
            var dbname1 = $scope.layer1.dbname.substr($scope.layer1.dbname.indexOf('_'));
            var dbname2 = $scope.layer2.dbname.substr($scope.layer2.dbname.indexOf('_'));
            $scope.layer1.newname = 'Union' + name1 + name2;
            $scope.layer1.newdbname = 'union'+dbname1+dbname2;
            $scope.layer1.dbname_b = $scope.layer2.dbname;
            $mdDialog.hide($scope.layer1);
        }

    };
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
        $mdDialog.hide($scope.activelayer.obj);
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
    $timeout($mdDialog.hide, 120);

}
