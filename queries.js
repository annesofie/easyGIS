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
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/AnneSofie';
var connectionString = 'postgres://localhost:5432/AnneSofie';
var cn = {
    host: 'ec2-184-73-216-242.compute-1.amazonaws.com',
    port: 5432,
    database: 'd1nbdgn5u9fh9s',
    user: 'ofufbplhdsewot',
    password: 'd6uTWxpFoW5Z0zNYOFrm3ZqdUj',
    ssl: true

};
//var db = pgp(cn);
var db = pgp(connectionString);

// add query functions

// Helper for linking to external query files:
function sql(file) {
    return new pgp.QueryFile(file, {minify: true});
}

// Create QueryFile globally, once per file:
var sqlGetAllLayers = sql('./sql/getAllLayers.sql');
var sqlAddLayer = sql('./sql/addLayer.sql');
var sqlgetLayer = sql('./sql/getLayer.sql');

var sqlcreateaddbufferlayer = sql('./sql/create_and_add_bufferlayer.sql');
var sqlcreateunionlayer = sql('./sql/create_union_layer.sql');
var sqlcreateuniontwolayers = sql('./sql/create_union_layer_twoinputs.sql');
var sqlcreatewitinlayer = sql('./sql/create_within_layer.sql');
var sqlcreatedifferencelayer = sql('./sql/create_difference_layer.sql');

var sqladdgeojsonlayer = sql('./sql/addGeojsonLayer.sql');

var sqlcreatetablegeomproperties = sql('./sql/create_table(gid,geom,properties).sql');

function getLayernames(req, res) {
    db.any(sqlGetAllLayers)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all layers from table'
                });
        })
        .catch(function (err) {
            if (error instanceof pgp.errors.QueryFileError) {
                // => the error is related to our QueryFile
                console.log('There is a problem with the queryfile');
            }
            return res.status(400).json(err);
        });
}
function addLayer(req, res) {
    db.none(sqlAddLayer, req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'layer is inserted in the layer list'
                });
        })
        .catch(function (err) {
            if (error instanceof pgp.errors.QueryFileError) {
                // => the error is related to our QueryFile
                console.log(err);
            }
            return res.status(400).json({
                status: 'failes',
                message: JSON.stringify(err)
            });
        });
}
function getAllFromTable(req, res) {
    console.log(req.params.dbname);
    db.any(sqlgetLayer, {table: req.params.dbname})
        .then(function(data){
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
    console.log(req.body);
    db.none(sqlcreateaddbufferlayer, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added bufferlayer in new table'
                });
        })
        .catch(function (err) {

            return res.status(400).json(err);
        });
}
/*function createIntersectionWithBuffLayer(req, res) {
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
                    data: data,
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
}*/
function createWithinLayer(req, res) {
    console.log(req.body);
    db.none(sqlcreatewitinlayer, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added within layer in new table'
                });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });

}
function createUnionLayer(req, res) {
    console.log(req.body);
    db.none(sqlcreateunionlayer, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added union in new table'
                });
        })
        .catch(function (err) {

            return res.status(400).json(err);
        });
}
function createUnionLayerFromTwoLayers(req, res) {
    console.log(req.body);
    db.none(sqlcreateuniontwolayers, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added union in new table'
                });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });
}
function createDifferenceLayer(req, res) {
    console.log(req.body);
    db.none(sqlcreatedifferencelayer, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added differencelayer in new table'
                });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });
}

function createtablegeomprop(req, res){   //Create table with geom and properties as attributes

    db.none(sqlcreatetablegeomproperties, req.body)
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Created table'
                });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });
}

function insertgeojsonlayer(req, res) {

    db.none(sqladdgeojsonlayer, req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Added geosjon in table'
                });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });
}

module.exports = {
    getLayernames: getLayernames,
    addLayer: addLayer,
    getAllFromTable: getAllFromTable,
    createNewTable: createNewTable,
    createBufferLayer: createBufferLayer,
    createWithinLayer: createWithinLayer,
    createUnionLayer: createUnionLayer,
    createUnionLayerFromTwoLayers: createUnionLayerFromTwoLayers,
    createDifferenceLayer: createDifferenceLayer,
    createtablegeomprop: createtablegeomprop,
    insertgeojsonlayer: insertgeojsonlayer
};