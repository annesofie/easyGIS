/**
 * Created by AnneSofie on 30.04.2016.
 *
 * Here we create a new instance of Client to interact with the database and then
 * establish communication with it via the connect() method.
 * We then set run a SQL query via the query() method.
 * Communication is closed via the end() method.
 */

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });

