/**
 * Created by AnneSofie on 01.05.2016.
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/';


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get('/api/layer/:dbname', function(req, res) {

    var results = [];
    var dbname = req.params.dbname;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        // SQL Query > Select Data
        if(dbname == 'kommune'){
            var query = client.query("SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((SELECT l FROM (SELECT gid, db_name, komm_navn) As l)) As properties FROM "+dbname+" As lg   ) As f )  As fc;");
        } else if(dbname == 'trafikkmengde'){
            var query = client.query("SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((SELECT l FROM (SELECT gid, vei_navn) As l)) As properties FROM "+dbname+" As lg   ) As f )  As fc;");
        }else {
            var query = client.query("SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((SELECT l FROM (SELECT gid, db_name) As l)) As properties FROM "+dbname+" As lg   ) As f )  As fc;");
        }

        // Stream results back one row at a time
        query.on('row', function(row) {
            //console.log(row);
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.status(200).json(results);
        });

    });

});

router.post('/api/layer', function(req, res) {

    var results = [];
    console.log('inni post');
    //Data from http request
    var name = req.body.newname;
    var dbname = req.body.dbname;
    var dist = req.body.buffdist;
    var newdbname = req.body.newdbname;
    console.log(name+', '+dbname+', '+dist+'');

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        //client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);'
        var query = client.query('CREATE TABLE '+newdbname+' AS SELECT ST_AsText(ST_Buffer(db.geom, '+dist+')) AS geom FROM '+dbname+' AS db');
        query.on('end', function() { client.end();
            console.log('added');
        });

        // SQL Query > Select Data
        //var query = client.query("SELECT * FROM items ORDER BY id ASC");

        /*/ Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results, return status 200
        query.on('end', function() {
            done();
            return res.status(200).json(name);
        });*/


    });
});


module.exports = router;