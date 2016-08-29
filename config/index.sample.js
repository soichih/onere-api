'use strict';

var fs = require('fs');
var winston = require('winston');

exports.debug = true;

exports.auth = {
    pubkey: fs.readFileSync('/home/hayashis/git/auth/api/config/auth.pub'),
}

exports.mongodb = "mongodb://localhost:27017/onere";

exports.express = {
    //host: 0.0.0.0,
    port: 12508,
}

//configuration used to run a test
exports.test = {
    jwt: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NjYS5pdS5lZHUvYXV0aCIsImlhdCI6MTQ2MzQ5MzgxNy4xMzMsInNjb3BlcyI6eyJzY2EiOlsidXNlciJdfSwic3ViIjoidGVzdF9zZXJ2aWNlIn0.qEDod2KkMhoDJK1IZ8cTwEm4TDUMKGDzHCpMYvtEDnd6vr0fiSlzBcVe-srEonSjBuO0NcGRrmBQXHbX-ftDay5CXK27W-pwcgwjc7GkTw_bTe1Z8Y1c8jlNwvcHbE_pJk6ZCHBRQCEvpoUeSOFGKRgORG8H144LKnjEIeD_VbY",
}

exports.logger = {
    winston: {
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    var d = new Date();
                    return d.toString(); 
                },
                level: 'debug',
                colorize: true
            }),
        ]
    },
}

