/**
 * Created by AnneSofie on 29.02.2016.
 */

easygis.factory('fileHandler', ['$q', function(){
    var reader = new FileReader();
    var geoJsonData = new ol.format.GeoJSON();

    return ({
        handleFile: handleFile
    });

    function handleFile(file){
        var name = file.name;
        if(name.endsWith('.zip')){
            return handleZip(file);
        }else if (name.endsWith('.sos')){
            return handleSosi(file);
        }
    }



}])