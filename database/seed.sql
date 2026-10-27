USE rwanda_population_react;
INSERT IGNORE INTO locations(id,parent_id,name,location_type) VALUES
(1,NULL,'Kigali City (Demo)','province'),
(2,1,'Gasabo (Demo)','district'),
(3,2,'Kimironko (Demo)','sector'),
(4,3,'Bibare (Demo)','cell'),
(5,4,'Demo Village','village');
