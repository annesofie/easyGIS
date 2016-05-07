/**
 * Created by AnneSofie on 07.05.2016.
 */


var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/AnneSofie';
var db = pgp(connectionString);

// add query functions

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
    db.none('CREATE TABLE IF NOT EXISTS '+dbname+'(gid SERIAL PRIMARY KEY, geom text not null, name VARCHAR(20))')
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
    console.log(dist + ' = dists');
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

module.exports = {
    getAllFromTable: getAllFromTable,
    createBufferLayer: createBufferLayer
};