/**
 * Created by AnneSofie on 09.04.2016.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var polygonLayers = require('../models/polygonLayers.js');

router.get('/polygonlayer', function(req, res, next) {
    polygonLayers.find(function(err, pol_layers) {
        if (err) return next(err);
        res.status(200).json(pol_layers);
    })
});

router.post('/addpolygonlayer', function(req, res, next) {
    polygonLayers.create(
        {
            'name': req.body.name,
            'name_buff': req.body.name_buff,
            'tileURL': req.body.tileURL
        },
        function(err, layer) {
            if (err){
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(200).json(layer);
    })
});

router.get('/polygonlayer/:id', function(req, res, next) {
    polygonLayers.findById(req.params.id, function(err, pol_layer) {
        if (err) return next(err);
        res.json(pol_layer);
    })
});


module.exports = router;