'use strict';

//contrib
var request = require('supertest')
var assert = require('assert');
var fs = require('fs');

//mine
var config = require('../config');
var db = require('../models');
var app = require('../server').app;

before(function(done) {
    db.init(function(err) {
        if(err) return done(err);
        done();
    });
});

describe('/application', function() {
    var application = null;
    it('should create application', function(done) {
        request(app)
        .post('/application')
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
        .send({
            name: "test name",
            container_url: "soichih/test", 
            config: { "app1": "test", "app2": "whatever" },
        })
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            application = res.body;
            assert(application.user_id == "test_service");
            assert(application.name == "test name");
            done();
        });
    });
    
});
