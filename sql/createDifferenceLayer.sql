CREATE TABLE ${newdbname~} as
	select
		ST_AsText(st_difference(union_pub_buff_88_m.geom, union_restaurant_buff_11_m.geom)) as geom
	from union_pub_buff_88_m, union_restaurant_buff_11_m;

alter table difference_test_layers add column gid SERIAL;
update difference_test_layers set gid = default;
alter table difference_test_layers add primary key (gid);