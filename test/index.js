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

    it('should find an application', function(done) {
        request(app)
        .get('/application')
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
        .query({
            find: JSON.stringify({_id: application._id}),
            limit: 1,
            select: 'name create_date user_id',
        })
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            var recs = res.body.applications;
            //console.dir(recs);
            assert(recs.length == 1);
            assert(recs[0].user_id == "test_service");
            assert(recs[0].name == "test name");
            done();
        });
    });

    it('shoud remove an application', function(done) {
        request(app)
        .delete('/application/'+application._id)
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            done();
        });
    
    });
});

describe('/dataset', function() {
    var dataset = null;
    it('should create dataset', function(done) {
        request(app)
        .post('/dataset')
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
        .send({
            name: "test name",
            storage: "dc2",
            path: "/N/dc2/somewhere", 
            config: { "app1": "test", "app2": "whatever" },
        })
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            dataset = res.body;
            assert(dataset.user_id == "test_service");
            assert(dataset.config.app1 == "test");
            done();
        });
    });

    it('should find the dataset', function(done) {
        request(app)
        .get('/dataset')
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
            .query({
            find: JSON.stringify({_id: dataset._id}),
            limit: 1,
            select: 'name create_date user_id',
        })
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            var recs = res.body.datasets;
            //console.dir(recs);
            assert(recs.length == 1);
            assert(recs[0].user_id == "test_service");
            assert(recs[0].name == "test name");
            done();
        });
    });

    it('shoud remove a dataset', function(done) {
        request(app)
        .delete('/dataset/'+dataset._id)
        .set('Authorization', 'Bearer '+config.test.jwt)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            done();
        });
    });
    
});
