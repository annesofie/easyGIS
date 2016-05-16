
CREATE TABLE ${newdbname~} AS
	SELECT
		ST_AsText(st_union(${dbname~}.geom)) AS geom
	FROM ${dbname~};

alter table ${newdbname~} add column gid SERIAL;
update ${newdbname~} set gid = default;
alter table ${newdbname~} add primary key (gid);