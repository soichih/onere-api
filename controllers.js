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
    res.json({status: 'ok'});
});

/**
 * @api {get} /entry            Query Registrations
 * @apiDescription              Query registered ONORE entrires
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
router.get('/entry', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var find = {};
    if(req.query.find) find = JSON.parse(req.query.find);

    //TODO - I need to map SCA group ID (numeric) to ODI PROP IDs and apply filter based on it
    //(most likely maintained through ODI service?)
    //for now, only search for test PROPID (except mastercals)
    //if(!~find.type.indexOf("master_")) find['headers.PROPID'] = 'test';
    logger.debug(find);

    db.Entries.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .exec(function(err, entries) {
        if(err) return next(err);
        db.Entries.count(find).exec(function(err, count) {
            if(err) return next(err);
            res.json({entries: entries, count: count});
        });
    });
});

/**
 * @api {get} /stage Request to stage ODI exposures
 * @apiDescription From a list of exposure_ids, it makes sure user has access to it,
 * find where the data is (on disk, sda, etc..) TODO - thaw them if necessary
 * and 
 * @apiParam {String[]} exposure_ids List of exposure IDs to thaw / stage
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]} exposures staged
 */
/*
router.post('/stage', jwt({secret: config.odi.auth_pubkey}), function(req, res, next) {
    var exposure_ids = req.body.exposure_ids;
    var find = {
        'headers.PROPID': {$in: ['test']}, //TODO apply realy access control
        '_id': {$in: [exposure_ids]},
    };
    db.Exposures.find(find)
    .select('logical_id') 
    .exec(function(err, exposures) {
        if(err) return next(err);

        //ssh to karst and setup 
        var conn = new Client();
        conn.on('ready', function() {
        });
        conn.connect({
            host: config.odi.host,
            username: config.odi.username,
            privateKey: config.odi.pkey,
        });
        res.json({status: "ok"});
    });
});
*/

module.exports = router;
