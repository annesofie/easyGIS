
DROP TABLE IF EXISTS ${dbname~};

DELETE FROM layers WHERE layers.dbname ilike ${dbname};