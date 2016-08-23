# ONORE-API

ONORE REST API server

Testing registering data
==========================

1. Run onere service :
    node onore.js

2. Send a post request to register data to local mongo db
    curl  -H "Content-Type: application/json" -X POST -d  '{"id":1,"name":"life1","desc":"testDesc","created_date":"2016-08-23","status":"success","host":"karst.iu.edu","working_dir":"/home/test/a","appname":"testApp"}' http://localhost:12508/register

