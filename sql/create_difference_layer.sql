
CREATE TABLE ${newdbname~} as
	select
		ST_AsText(ST_difference(${dbname_a~}.geom, ${dbname_b~}.geom)) as geom
	from ${dbname_a~}, ${dbname_b~};

alter table ${newdbname~} add column gid SERIAL;
update ${newdbname~} set gid = default;
alter table ${newdbname~} add primary key (gid)