# easyGIS
This web-GIS contains the elementary GIS operations


# EasyGIS
## with GIS Turorial
### Enjoy!


##Objects

Polygonlayer = {
    name: '',
    dist: num,
    tileURL: '',
    datatype: '',
    tablename: ''     //In CartoDB
}

Pointlayer = {
    name: '',
    tileURL: '',
    datatype: '',
    tablename: ''    //In CartoDB
}

Linelayer = {
    name: '',
    tileURL: '',
    datatype: '',
    tablename: ''    //In CartoDB
}

## API 


| GET      |          |   |
| ------------- |:-------------:| -----:|
| /layers/polygonlayer        | Returns all polygonlayers             | |
| /layers/pointlayer          | Returns all pointlayers               | |
| /layers/linelayer           | Returns all linelayers                | |
| /layers/polygonlayer/:name  | Returns a polygon with the given name | |
| /layers/pointlayer/:name    | Returns a point with the given name   | |
| /layers/linelayer/:name     | Returns a line with the given name    | |


| POST      |   add new layer     |   |
| ------------- |:-------------:| -----:|
| /layers/addpolygonlayer | Adds a new polygonlayer   | |
| /layers/addpointlayer   | Adds a new pointlayer     | |
| /layers/addlinelayer    | Adds a new linelayer      | |


| DELETE      |   add new layer     |   |
| ------------- |:-------------:| -----:|
| /layers/polygonlayer/:id | Deletes the polygonlayer with the given id  | |
| /layers/pointlayer/:id   | Deletes the pointlayer with the given id  | |
| /layers/linelayer/:id    | Deletes the linelayer with the given id  | |
