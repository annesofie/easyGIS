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
        console.log($scope.bufferdist);
        if (!$scope.layer) {
            alert("You have to write a bufferdistance");
        } else if ($scope.bufferdist < 0) {
            alert("Bufferdistance cannot be negative");
        } else {
            $scope.layer.buffdist = $scope.bufferdist;
            $scope.layer.datatype = 'Polygon';
            $scope.layer.newname = $scope.layer.layername + ' buff ' + $scope.bufferdist + 'm';
            $scope.layer.newdbname = $scope.layer.dbname + '_buff_' + $scope.bufferdist + '_m';
            $mdDialog.hide($scope.layer);
        }
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
        if (!$scope.layername || !$scope.layer) {
            alert("Missing input. Remember to write a name for the new layer");
        } else if ($scope.polygonlayer) {
            $scope.layer.b_dbname = $scope.polygonlayer.dbname;
            $scope.layer.newname = $scope.layername;
            $scope.layer.newdbname = $scope.layername.replace(/\s/g,"_").toLowerCase();
            $mdDialog.hide($scope.layer);
        } else {
            alert("Something went wrong. Remember to write a name for the new layer");

        }
    };
}
function DialogController_union($scope, $mdDialog, layers) {
    $scope.layer1 = null;
    $scope.layer2 = null;
    $scope.layers = layers;
    $scope.layername = null;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        if (!$scope.layername || !$scope.layer1) {
            alert("Missing input. Remember to write a name for the new layer");
        } else if (answer == 1) {
            if ($scope.layername.toLowerCase().indexOf('union') == -1) {
                $scope.layername = 'Union ' + $scope.layername;
                console.log($scope.layername);
            }
            $scope.layer1.type = 1;
            $scope.layer1.newname = $scope.layername;
            $scope.layer1.newdbname = $scope.layername.replace(/\s/g,"_").toLowerCase();
            $mdDialog.hide($scope.layer1);
        } else if (answer == 2 && $scope.layer2){
            if ($scope.layername.toLowerCase().indexOf('union') == -1) {
                $scope.layername = 'union ' + $scope.layername;
                console.log($scope.layername);
            }
            $scope.layer1.type = 2;
            $scope.layer1.newname = $scope.layername;
            $scope.layer1.newdbname = $scope.layername.replace(/\s/g,"_").toLowerCase();
            $scope.layer1.dbname_b = $scope.layer2.dbname;
            $mdDialog.hide($scope.layer1);
        } else {
            alert("Something went wrong. Remember to write a name for the new layer");
        }

    };
}
function DialogController_difference($scope, $mdDialog, layers) {
    $scope.layer1 = null;
    $scope.layer2 = null;
    $scope.layers = layers;
    $scope.layername = '';

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        console.log(answer);
        if (!$scope.layername || !$scope.layer1 || !$scope.layer2) {
            //Cannot do operation, need a name
            alert("Missing input. Remember to write a name for the new layer");
        } else {
            $scope.layer1.newname = $scope.layername;
            $scope.layer1.newdbname = $scope.layername.replace(/\s/g,"_").toLowerCase();
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
        var name = $scope.file.name;
        if (!name.endsWith('.geojson')){
            alert('Can only upload geojson files');
        } else if ($scope.file != null) {
            UploadService.handleFile($scope.file).then(function (data) {
                var newlayer = {name: $scope.layername, newdbname: $scope.layername.replace(/\s/g,"_").toLowerCase(), geojsonbody: data};
                $mdDialog.hide(newlayer);
            });
        } else {
            alert('Something went wrong, try again.')
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
    $timeout($mdDialog.hide, 1000);

}
