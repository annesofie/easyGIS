/**
 * Created by AnneSofie on 07.05.2016.
 */


var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
console.log(process.env.DATABASE_URL);
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/AnneSofie';
var cn = {
    host: 'ec2-184-73-216-242.compute-1.amazonaws.com',
    port: 5432,
    database: 'd1nbdgn5u9fh9s',
    user: 'ofufbplhdsewot',
    password: 'd6uTWxpFoW5Z0zNYOFrm3ZqdUj',
    ssl: true

};
var db = pgp(cn);
//var db = pgp(connectionString);

// add query functions

function getLayernames(req, res) {
    db.any("SELECT * FROM layers")
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all layers from table'
                });
        })
        .catch(function (err) {
            return res.status(400).json(err);
        });
}
function addLayer(req, res) {
    console.log(req.body);
    db.none("INSERT INTO layers (layername, dbname, datatype) " +
        " VALUES (${layername}, ${dbname}, ${datatype})", req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'layer is inserted in layers'
                });
        })
        .catch(function (err) {
            return res.status(400).json({
                status: 'failes',
                message: JSON.stringify(err)
            });
        });
}
function getAllFromTable(req, res) {
    var dbname = req.params.dbname;
    db.any("SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((SELECT l FROM (SELECT gid) As l)) As properties FROM "+dbname+" As lg   ) As f )  As fc;")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL from table'
                });
        })
        .catch(function (err) {
            return res.status(400).json(err);
        });
}
function createNewTable(req, res) {
    var dbname = req.params.dbname;
    db.none('CREATE TABLE IF NOT EXISTS '+dbname+'(id SERIAL PRIMARY KEY, name VARCHAR(20), dbname VARCHAR(20));'
    + 'INSERT INTO '+dbname+' (id, name, dbname) VALUES'
            + '(1, Pub, pub),')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Created table: ' + dbname
                });
        })
        .catch(function (err) {
            return res.status(400).json(err);
        });
}
function createBufferLayer(req, res) {
    //Data from http request
    var name = req.body.newname;
    var dbname = req.body.dbname;
    var dist = req.body.buffdist;
    var newdbname = req.body.newdbname;
    console.log(dbname + ' = dbname');
    console.log(dist + ' = dist');
    console.log('createbufferlayer');

    db.none('CREATE TABLE IF NOT EXISTS '+newdbname+' (gid SERIAL PRIMARY KEY, geom text not null);'+
        ' INSERT INTO '+newdbname+' (gid, geom) '+
          ' SELECT row_number() OVER () as gid, ST_AsText(ST_Buffer(ST_GeomFromText('+dbname+'.geom)::geography, '+dist+')::geometry) AS geom FROM '+dbname+';')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Bufferlayer added to ' + dbname
                });
        })
        .catch(function (err) {
            return res.status(400).json(err);
        });
}
function createIntersectionWithBuffLayer(req, res) {
    //Data from http requests
    console.log('inside create intersection layer');
    var a_dbname = req.body.a_dbname;
    var b_dbname = req.body.b_dbname;
    var newdbname = req.body.newdbname;
    console.log(req.body);

    db.none('CREATE TABLE IF NOT EXISTS '+newdbname+' (gid SERIAL PRIMARY KEY, geom text not null); '+
    ' INSERT INTO '+newdbname+' (geom) '+
    ' SELECT  CASE  WHEN ST_CoveredBy('+a_dbname+'.geom, '+b_dbname+'.geom) ' +
        ' THEN '+a_dbname+'.geom ELSE ST_AsText(ST_Multi(ST_Intersection('+a_dbname+'.geom, '+b_dbname+'.geom))) ' +
    ' END AS geom FROM '+a_dbname+' INNER JOIN '+b_dbname+' ON ST_Intersects('+a_dbname+'.geom, '+a_dbname+'.geom);')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Intersectionlayer is added'
                });
        })
        .catch(function (err) {
           // console.log(err.toString());
            return res.status(400).json({
                status: 'failed',
                message: JSON.stringify(err)
            });
        });
}

module.exports = {
    getLayernames: getLayernames,
    addLayer: addLayer,
    getAllFromTable: getAllFromTable,
    createNewTable: createNewTable,
    createBufferLayer: createBufferLayer,
    createIntersectionWithBuffLayer: createIntersectionWithBuffLayer
};