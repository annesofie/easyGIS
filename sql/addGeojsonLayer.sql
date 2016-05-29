
INSERT INTO ${newdbname~} (geom, properties)
	WITH data AS (SELECT
	 ${geojsonbody}
	::json as fc)
	SELECT
	   ST_AsText(ST_GeomFromGeoJson(feat->>'geometry')) AS geom,
	   feat->'properties' AS properties
	FROM (
	    SELECT fc AS feat
	    FROM data
) AS fsa;