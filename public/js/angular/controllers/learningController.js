/**
 * Created by AnneSofie on 13.02.2016.
 */

easygis.controller('learningController', ['$scope', function($scope) {

    $scope.checkboxes = [
        {
            'nr': '1',
            'name': 'Add layer',
            'desciption': 'Locate the button in the left menu where the description is Add a layer. Click and a list with all the available layers appears. Click on one layer and wait intil it is loaded on the map.'
        },
        {
            'nr': '2',
            'name': 'Change color',
            'desciption': 'When a layer is added to the map you can start editing it. Press the Edit active layer button and the layers you have added to the map appears. Click on the layer you want to change and the edit menu is located below. Choose a color from the colorpicker, then press the add button.'
        },
        {
            'nr': '3',
            'name': 'Create a Buffer layer',
            'desciption': 'Click create buffer and the buffer menu will appear. Choose wanted layer and write a number representing the bufferdistance in meters. Press Create Buffer and wait until the new bufferlayer is added to the map.'
        }
        ,
        {
            'nr': '4',
            'name': 'Add a Point layer',
            'desciption': 'When a layer is added to the map you can start editing it. Press the Edit active layer button and the layers you have added to the map appears and the edit menu is located below. Click on the layer you want to change and choose a color from the colorpicker, then press the add button.'
        },
        {
            'nr': '5',
            'name': 'Find intersection between the bufferlayer and the point layer',
            'desciption': 'When a layer is added to the map you can start editing it. Press the Edit active layer button and the layers you have added to the map appears and the edit menu is located below. Click on the layer you want to change and choose a color from the colorpicker, then press the add button.'
        }
    ];

    $scope.hidehelp = false;
    $scope.hintHelp = function(checkboxnr) {
        return checkboxnr == $scope.helpnr;
    };

    $scope.helpnr = null;
    $scope.needhelp = function(hintnr) {
        $scope.helpnr = hintnr;
    };

    $scope.hidehelp = function(itemnr) {
        return itemnr !== $scope.helpnr;
    }


}]);