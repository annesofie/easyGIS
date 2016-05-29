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
    $scope.layername = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        if (!$scope.layername) {
            //Cannot do operation, need a name
            alert("You have to give the new layer a name");
        } else if(answer == 0) {
            $scope.layer.intervar= $scope.name;
            $scope.layer.intername = $scope.name;
            console.log(JSON.stringify($scope.layer) + ' input inter_city');
            $mdDialog.hide($scope.layer);

        } else if (answer == 1) {
            $scope.layer.b_dbname = $scope.polygonlayer.dbname;
            $scope.layer.newname = $scope.layername;
            $scope.layer.newdbname = $scope.layername.replace(/\s/g,"_");
            console.log(JSON.stringify($scope.layer) + ' input inter_buff');
            $mdDialog.hide($scope.layer);
        }
    };
}
function DialogController_union($scope, $mdDialog, layers) {
    $scope.layer1 = null;
    $scope.layer2 = null;
    $scope.layers = layers;
    $scope.layername;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        console.log(answer);
        if (!$scope.layername) {
            //Cannot do operation, need a name
            alert("You have to give the new layer a name");
        }else if (answer == 1) {
            $scope.layer1.type = 1;
            $scope.layer1.newname = $scope.layername;
            $scope.layer1.newdbname = $scope.layername.replace(/\s/g,"_");
            $mdDialog.hide($scope.layer1);
        } else if (answer == 2){
            $scope.layer1.type = 2;
            $scope.layer1.newname = $scope.layername;
            $scope.layer1.newdbname = $scope.layername.replace(/\s/g,"_");
            $scope.layer1.dbname_b = $scope.layer2.dbname;
            $mdDialog.hide($scope.layer1);
        }

    };
}
function DialogControllerUploadFile($scope, $mdDialog, UploadService) {

    $scope.file = null;
    $scope.layername = null;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        if ($scope.file != null) {
            console.log($scope.file);
            UploadService.handleFile($scope.file).then(function (data) {
                console.log(data);
                var newlayer = {name: $scope.layername, newdbname: $scope.layername.replace(/\s/g,"_"), geojsonbody: data};
                $mdDialog.hide(newlayer);
            });
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
