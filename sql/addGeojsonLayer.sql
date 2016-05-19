
CREATE TABLE IF NOT EXISTS ${newdbname~} (gid SERIAL PRIMARY KEY, geom text not null);
INSERT INTO ${newdbname~} (gid, geom)
	WITH data AS (SELECT
        ${geojsonbody~}
	::json as fc)
	SELECT
	   row_number() OVER () as gid,
	   ST_AsText(ST_GeomFromGeoJson(feat->>'geometry')) AS geom
	FROM (
	    SELECT json_array_elements(fc->'features') AS feat
	    FROM data
) AS fsa