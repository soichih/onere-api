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
 * @apiGroup Appdata
 * @api {get} /appdata          Query appdatas
 * @apiDescription              Query appdatas registered
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

    db.Appdatas.find(find)
    .select(req.query.select || 'create_date')
    .limit(req.query.limit || 100)
    .skip(req.query.skip || 0)
    .sort(req.query.sort || '_id')
    .populate('project_id', 'name desc')
    .populate('dataset_id', 'name desc')
    .populate('application_id', 'name desc config.type')
    //.populate('application_id dataset_id')
    .exec(function(err, recs) {
        if(err) return next(err);
        db.Appdatas.count(find).exec(function(err, count) {
            if(err) return next(err);
            res.json({appdatas: recs, count: count});
        });
    });
});

/**
 * @apiGroup Appdatas
 * @api {post} /appdata         Post Appdata
 * @apiDescription              Register new appdata
 *
 * @apiParam {String} name      User friendly name for this container 
 * @apiParam {String} desc      Description for this dataset 
 *
 * @apiParam {Object} config    Metadata for this appdata (TODO..)
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Appdata record registered
 */
router.post('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;
    
    //TODO prevent user from re-registering / overriding existing entries with the same storage/path

    //now save
    var appdata = new db.Appdatas(req.body);
    appdata.save(function(err) {
        if (err) return next(err); 
        logger.debug('appdata registered...');
        res.json(appdata);
    });
});

/**
 * @apiGroup Appdata
 * @api {put} /appdata/:id
 *                              Put Appdata
 * @apiDescription              Update appdata
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
    db.Appdatas.findById(dataset_id, function(err, appdata) {
        if(err) return next(err);
        if(!appdata) return res.status(404).end();

        if(appdata.user_id != req.user.sub) return res.status(401).end("user_id mismatch .. req.user.sub:"+req.user.sub);

        //only allow update to certain fields
        if(req.body.name) appdata.name = req.body.name;
        if(req.body.desc) appdata.desc = req.body.desc;
        if(req.body.config) appdata.config = req.body.config;

        appdata.save(function(err) {
            if(err) return next(err);
            res.json(appdata);
        });
    });
});

/**
 * @apiGroup                    Appdata
 * @api {delete} /appdata/:id
 *                              Remove registered appdata (only by the user registered it)
 * @apiDescription              Physically remove a appdata registered on DB.
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
router.delete('/:id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var id = req.params.id;
    db.Appdatas.remove({_id: id, user_id: req.user.sub}, function(err) {
        if(err) return next(err);
        res.json({message: "Appdata successfully removed"});
    });
});

module.exports = router;
