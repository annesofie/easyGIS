/**
 * Created by AnneSofie on 07.05.2016.
 */


var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/layers/all', db.getLayernames);
router.post('/api/layer/new', db.addLayer);
router.get('/api/layer/:dbname', db.getAllFromTable);
router.post('/api/layer/buffer', db.createBufferLayer);
router.post('/api/layer/:dbname', db.createNewTable);
/*router.get('/api/puppies/:id', db.getSinglePuppy);
router.post('/api/puppies', db.createPuppy);
router.put('/api/puppies/:id', db.updatePuppy);
router.delete('/api/puppies/:id', db.removePuppy);*/

module.exports = router;