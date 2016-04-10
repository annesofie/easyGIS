/**
 * Created by AnneSofie on 09.04.2016.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var polygonLayers = require('../models/polygonLayers.js');
var pointLayers = require('../models/pointLayers.js');
var lineLayers = require('../models/lineLayers.js');


// ** Get all layers in table
router.get('/polygonlayer', function(req, res, next) {
    polygonLayers.find(function(err, pol_layers) {
        if (err) return next(err);
        res.status(200).json(pol_layers);
    })
});
router.get('/pointlayer', function(req, res, next) {
    pointLayers.find(function(err, point_layers) {
        if (err) return next(err);
        res.status(200).json(point_layers);
    })
});
router.get('/linelayer', function(req, res, next) {
    lineLayers.find(function(err, line_layers) {
        if (err) return next(err);
        res.status(200).json(line_layers);
    })
});

// ** Add a new layer
router.post('/addpolygonlayer', function(req, res, next) {
    polygonLayers.create(
        {
            'name': req.body.name,
            'dist': req.body.dist,
            'tileURL': req.body.tileURL,
            'datatype': 'Polygon',
            'tablename': req.body.tablename
        },
        function(err, layer) {
            if (err){
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(200).json(layer);
    })
});
router.post('/addpointlayer', function(req, res) {
    pointLayers.create(
        {
            'name': req.body.name,
            'tileURL': req.body.tileURL,
            'datatype': 'Point',
            'tablename': req.body.tablename
        },
        function(err, layer) {
            if (err){
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(200).json(layer);
        })
});
router.post('/addlinelayer', function(req, res) {
    lineLayers.create(
        {
            'name': req.body.name,
            'tileURL': req.body.tileURL,
            'datatype': 'Line',
            'tablename': req.body.tablename
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
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(pol_layer));
        return res.status(200).json(pol_layer);
    })
});

// ** Get layer by name
router.get('/polygonlayer/one/:name', function(req, res, next) {
    console.log(req.params.name + ' params.name');
    polygonLayers.findOne({name: req.params.name}, function(err, pol_layer) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(pol_layer));
        return res.status(200).json(pol_layer);
    })
});
router.get('/pointlayer/one/:name', function(req, res) {
    console.log(req.params.name + ' params.name');
    pointLayers.findOne({name: req.params.name}, function(err, point_layer) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(point_layer));
        return res.status(200).json(point_layer);
    })
});
router.get('/linelayer/one/:name', function(req, res) {
    console.log(req.params.name + ' params.name');
    lineLayers.findOne({name: req.params.name}, function(err, line_layer) {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(line_layer));
        return res.status(200).json(line_layer);
    })
});

// ** Delete layer by id
router.delete('/polygonlayer/:id', function(req, res){
    polygonLayers.findByIdAndRemove(req.params.id, req.body, function(err, layer){
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(layer));
        return res.status(200).json(layer);
    })
});
router.delete('/pointlayer/:id', function(req, res){
    pointLayers.findByIdAndRemove(req.params.id, req.body, function(err, layer){
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(layer));
        return res.status(200).json(layer);
    })
});
router.delete('/linelayer/:id', function(req, res){
    lineLayers.findByIdAndRemove(req.params.id, req.body, function(err, layer){
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log(JSON.stringify(layer));
        return res.status(200).json(layer);
    })
});


module.exports = router;