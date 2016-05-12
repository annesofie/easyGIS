

CREATE TABLE IF NOT EXISTS '+newdbname+' (gid SERIAL PRIMARY KEY, geom text not null);
        INSERT INTO '+newdbname+' (gid, geom) '+
           SELECT
                row_number() OVER () as gid,
                ST_AsText(ST_Buffer(ST_GeomFromText('+dbname+'.geom)::geography, '+dist+')::geometry) AS geom
            FROM '+dbname+';