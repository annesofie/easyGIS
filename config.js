/**
 * Created by AnneSofie on 30.04.2016.
 */

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/';


module.exports = connectionString;