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
 * @apiGroup Project
 * @api {get} /project          Query projects
 * @apiDescription              Query projects registered
 *
 * @apiParam {Object} find      Optional Mongo find query - defaults to {}
 * @apiParam {Object} sort      Optional Mongo sort object - defaults to {}
 * @apiParam {String} select    Optional Fields to load - defaults to 'logical_id'
 * @apiParam {Number} limit     Optional Maximum number of records to return - defaults to 100
 * @apiParam {Number} skip      Optional Record offset for pagination
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
router.get('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var find = {};
    if(req.query.find) find = JSON.parse(req.query.find);
    logger.debug(find);

    db.Projects.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .exec(function(err, recs) {
        if(err) return next(err);
        db.Projects.count(find).exec(function(err, count) {
            if(err) return next(err);
            res.json({projects: recs, count: count});
        });
    });
});

/**
 * @apiGroup Projects
 * @api {post} /project         Post Project
 * @apiDescription              Register new project
 *
 * @apiParam {String} name      User friendly name for this container 
 * @apiParam {String} desc      Description for this dataset 
 *
 * @apiParam {Object} config    Metadata for this project (TODO..)
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project record registered
 */
router.post('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;
    
    //TODO prevent user from re-registering / overriding existing entries with the same storage/path

    //now save
    var project = new db.Projects(req.body);
    project.save(function(err) {
        if (err) return next(err); 
        logger.debug('project registered...');
        res.json(project);
    });
});

/**
 * @apiGroup Project
 * @api {put} /project/:id
 *                              Put Project
 * @apiDescription              Update project
 *
 * @apiParam {String} [name]    User friendly name for this container 
 * @apiParam {String} [desc]    Description for this dataset 
 *
 * @apiParam {Object} config    Metadata for this dataset (TODO..)
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Dataset object updated
 */
router.put('/:id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var id = req.params.id;
    db.Projects.findById(dataset_id, function(err, project) {
        if(err) return next(err);
        if(!project) return res.status(404).end();

        if(project.user_id != req.user.sub) return res.status(401).end("user_id mismatch .. req.user.sub:"+req.user.sub);

        //only allow update to certain fields
        if(req.body.name) project.name = req.body.name;
        if(req.body.desc) project.desc = req.body.desc;
        if(req.body.config) project.config = req.body.config;

        project.save(function(err) {
            if(err) return next(err);
            res.json(project);
        });
    });
});

/**
 * @apiGroup                    Project
 * @api {delete} /project/:id
 *                              Remove registered project (only by the user registered it)
 * @apiDescription              Physically remove a project registered on DB.
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
/* I don't think we should remove projects - what happens to orphaned dataset / appdata, etc..? Maybe I should let user disable instead
router.delete('/:id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var id = req.params.id;
    db.Projects.remove({_id: id, user_id: req.user.sub}, function(err) {
        if(err) return next(err);
        res.json({message: "Project successfully removed"});
    });
});
*/

module.exports = router;
