/**
 * Created by AnneSofie on 07.05.2016.
 */


var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/layers/all', db.getLayernames);
router.post('/api/layer/new', db.addLayer);
router.get('/api/layer/:dbname', db.getAllFromTable);
router.post('/api/layer/buffer/', db.createBufferLayer);
router.post('/api/layer/within/', db.createWithinLayer);
router.post('/api/layer/unionlayer/oneinput/', db.createUnionLayer);
router.post('/api/layer/unionlayer/twoinput/', db.createUnionLayerFromTwoLayers);
router.post('/api/layer/newtable/geomproperties/', db.createtablegeomprop);
router.post('/api/layer/newgeojson/', db.insertgeojsonlayer);


router.post('/api/layer/:dbname', db.createNewTable);


module.exports = router;