'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var winston = require('winston');
var Client = require('ssh2').Client;

var config = require('../config');
var logger = new winston.Logger(config.logger.winston);
var db = require('../models');

/**
 * @apiGroup Service
 * @api {get} /application      Query Applications
 * @apiDescription              Query applications registered (public API)
 *
 * @apiParam {Object} find      Optional Mongo find query - defaults to {}
 * @apiParam {Object} sort      Optional Mongo sort object - defaults to {}
 * @apiParam {String} select    Optional Fields to load - defaults to 'logical_id'
 * @apiParam {Number} limit     Optional Maximum number of records to return - defaults to 100
 * @apiParam {Number} skip      Optional Record offset for pagination
 *
 * @apiSuccess {Object[]} resources        Resource detail
 */
//router.get('/', jwt({secret: config.auth.pubkey, credentialsRequired: false}), function(req, res, next) {
router.get('/', function(req, res, next) {
    var find = {};
    if(req.query.find) find = JSON.parse(req.query.find);
    logger.debug(find);

    db.Applications.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .populate('project_id', 'name desc')
    .populate('datasets.id', 'name desc config') //TODO - config.files maybe too expensive for researh page.. (add param?)
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
 * @apiParam {String} name      User friendly name for this app
 * @apiParam {String} desc      Description for this app
 *
 * @apiParam {Object} datasets  Array of {name: .. id: <dataset_id>}
 * @apiParam {Object} config    Application installed and how it's configured, etc..
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Application record registered
 */
router.post('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;

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
 * @apiGroup Application
 * @api {put} /application/:application_id
 *                              Put Application
 * @apiDescription              Update Application
 *
 * @apiParam {String} [name]    User friendly name for this app
 * @apiParam {String} [desc]    Description for this app
 *
 * @apiParam {Object} [datasets]  Array of {name: .. id: <dataset_id>}
 * @apiParam {Object} [config]  Config for this app
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Application object updated
 */
router.put('/:application_id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var application_id  = req.params.application_id;
    db.Applications.findById(application_id, function(err, application) {
        if(err) return next(err);
        if(!application) return res.status(404).end();
        //let's restrict to the same user for now.. It should probably allow anyone in the project?
        if(application.user_id != req.user.sub) return res.status(401).end("user_id mismatch .. req.user.sub:"+req.user.sub);

        if(req.body.name) application.name = req.body.name;
        if(req.body.desc) application.desc = req.body.desc;
        //if(req.body.service) application.service = req.body.service;
        if(req.body.datasets) application.datasets = req.body.datasets;
        if(req.body.config) application.config = req.body.config;

        application.save(function(err) {
            //logger.debug("application updated");
            //logger.debug(application.toString());
            if(err) return next(err);
            res.json(application);
        });
    });
});

/**
 * @apiGroup                    Application
 * @api {delete} /application/:application_id 
 *                              Remove registered application (only by the user registered it)
 * @apiDescription              Physically remove an application registered on DB.
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
router.delete('/:application_id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var id = req.params.application_id;
    db.Applications.remove({_id: id, user_id: req.user.sub}, function(err) {
        if(err) return next(err);
        res.json({message: "application successfully removed"});
    });
});

module.exports = router;
