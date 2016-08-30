'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var winston = require('winston');
var Client = require('ssh2').Client;

var config = require('./config');
var logger = new winston.Logger(config.logger.winston);
var db = require('./models');

/**
 * @api {get} /health Get current service status
 * @apiName Health
 * @apiGroup System
 *
 * @apiSuccess {String} status 'ok' or 'failed'
 */
router.get('/health', function(req, res) {
    //TODO...
    res.json({status: 'ok'});
});

/**
 * @apiGroup Application
 * @api {get} /application      Query Applications
 * @apiDescription              Query applications registered
 *
 * @apiParam {Object} find      Optional Mongo find query - defaults to {}
 * @apiParam {Object} sort      Optional Mongo sort object - defaults to {}
 * @apiParam {String} select    Optional Fields to load - defaults to 'logical_id'
 * @apiParam {Number} limit     Optional Maximum number of records to return - defaults to 100
 * @apiParam {Number} skip      Optional Record offset for pagination
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]} resources        Resource detail
 */
router.get('/application', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var find = {};
    if(req.query.find) find = JSON.parse(req.query.find);
    logger.debug(find);

    db.Applications.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .exec(function(err, recs) {
        if(err) return next(err);
        db.Applications.count(find).exec(function(err, count) {
            if(err) return next(err);
            res.json({applications: recs, count: count});
        });
    });
});

/**
 * @apiGroup Application
 * @api {post} /application     Post Application
 * @apiDescription              Register new application
 *
 * @apiParam {String} name      User friendly name for this container 
 * @apiParam {String} container_url URL of the container registered on docker registry ("onere/123123131")
 * @apiParam {Object} config    Application installed and how it's configured, etc..
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]}       Application record registered
 */
router.post('/application', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;

    //logger.debug("application posted");
    //logger.debug(req.body);
    
    //TODO prevent user from re-registering / overriding existing entries with the same container_url

    //now save
    var application = new db.Applications(req.body);
    application.save(function(err) {
        if (err) return next(err); 
        logger.debug('application registered...');
        res.json(application);
    });
});

/**
 * @apiGroup Dataset
 * @api {get} /dataset          Query datasets
 * @apiDescription              Query applications registered
 *
 * @apiParam {Object} find      Optional Mongo find query - defaults to {}
 * @apiParam {Object} sort      Optional Mongo sort object - defaults to {}
 * @apiParam {String} select    Optional Fields to load - defaults to 'logical_id'
 * @apiParam {Number} limit     Optional Maximum number of records to return - defaults to 100
 * @apiParam {Number} skip      Optional Record offset for pagination
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]} resources        Resource detail
 */
router.get('/dataset', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var find = {};
    if(req.query.find) find = JSON.parse(req.query.find);
    logger.debug(find);

    db.Datasets.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .exec(function(err, recs) {
        if(err) return next(err);
        db.Datasets.count(find).exec(function(err, count) {
            if(err) return next(err);
            res.json({datasets: recs, count: count});
        });
    });
});


/**
 * @apiGroup Dataset
 * @api {post} /dataset         Post Dataset
 * @apiDescription              Register new dataset
 *
 * @apiParam {String} name      User friendly name for this container 
 *
// * @apiParam {String} storage   Name of the storage system used 
// * @apiParam {String} path      Path where the .tar.gz is stored on above storage 
 *
 * @apiParam {Object} config    Metadata for this dataset (TODO..)
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]}       Dataset record registered
 */
router.post('/dataset', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;
    
    //TODO prevent user from re-registering / overriding existing entries with the same storage/path

    //now save
    var dataset = new db.Datasets(req.body);
    dataset.save(function(err) {
        if (err) return next(err); 
        logger.debug('dataset registered...');
        res.json(dataset);
    });
});


module.exports = router;
