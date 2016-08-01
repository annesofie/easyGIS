/**
 * Created by AnneSofie on 13.02.2016.
 */

easygis.controller('learningController', ['$scope', function($scope) {

    $scope.checkboxes = [
        {
            'nr': '1',
            'name': 'Add a layer to the map',
            'desciption': 'Locate the button in the left menu where the description is Add a layer. Click and a list with all the available layers appears. Click on one layer and wait intil it is loaded on the map.'
        },
        {
            'nr': '2',
            'name': 'Change color on that layer',
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
            'name': 'Add a Point layer to the map',
            'desciption': 'Use the add layer button and chose a layer under the point-layer header.'
        },
        {
            'nr': '5',
            'name': 'Find intersection between the buffer layer from 3. and the point layer from 4.',
            'desciption': 'Press the intersection button. First go to the Within a polygonlayer tab, find the bufferlayer you created in step 4 and click on it. Then in the other field find the pointlayer in the layerlist. Write a name for the new intersection layer, then press create layer.'
        },
        {
            'nr': '6',
            'name': 'Find intersection between the point layer from 4. and the buffer layer from 3.',
            'desciption': 'Press the intersection button. First go to the Within a pointlayer tab, find the pointlayer from task 3 in the first layerlist. Then in the other field find your bufferlayer in the layerlist. Write a name for the new intersection layer, then press create layer. '
        },
        {
            'nr': '7',
            'name': 'Look at the map and the two layers you created in task 5 and 6. ',
            'desciption': 'Now you can see the difference in creating a intersection layer. The output depens on the input and which order you intersect the layers.'
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