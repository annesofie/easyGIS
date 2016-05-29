CREATE TABLE IF NOT EXISTS ${newdbname~} (gid SERIAL PRIMARY KEY, geom text not null);
INSERT INTO ${newdbname~} (geom)
SELECT a.geom
FROM ${a_dbname~} AS a
   INNER JOIN ${b_dbname~} AS b
    ON ST_DWithin(ST_GeomFromText(a.geom), ST_GeomFromText(b.geom), 0.000001);