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
 */
router.get('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
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
 * @apiParam {String} desc      Description for this dataset 
 *
// * @apiParam {String} storage Name of the storage system used 
// * @apiParam {String} path    Path where the .tar.gz is stored on above storage 
 *
 * @apiParam {Object} config    Metadata for this dataset (TODO..)
 * @apiParam [String] tags      List of tag/keyword strings
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Dataset record registered
 */
router.post('/', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    //override some fieds
    req.body.user_id = req.user.sub;
    
    //TODO prevent user from re-registering / overriding existing entries with the same storage/path
    
    //req.body.storage = "dc2";
    //req.body.path = "/N/dc2/projects/lifebid/onere/datasets"; //make it configurable

    //now save
    var dataset = new db.Datasets(req.body);
    dataset.save(function(err) {
        if (err) return next(err); 
        logger.debug('dataset registered...');
        res.json(dataset);
    });
});

/**
 * @apiGroup Dataset
 * @api {put} /dataset/:dataset_id
 *                              Put Dataset
 * @apiDescription              Update dataset
 *
 * @apiParam {String} [name]    User friendly name for this container 
 * @apiParam {String} [desc]    Description for this dataset 
 *
 * @apiParam {Object} [config]  Metadata for this dataset (TODO..)
 * @apiParam [String] [config]  List of keyword/tags (brain region, species, method of recording, etc.)
 *
 * @apiHeader {String} authorization A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Dataset object updated
 */
router.put('/:dataset_id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var dataset_id  = req.params.dataset_id;
    db.Datasets.findById(dataset_id, function(err, dataset) {
        if(err) return next(err);
        if(!dataset) return res.status(404).end();
        //let's restrict to the same user for now.. It should probably allow anyone in the project?
        if(dataset.user_id != req.user.sub) return res.status(401).end("user_id mismatch .. req.user.sub:"+req.user.sub);

        //logger.debug("updating dataset "+dataset_id);
        //console.dir(req.body);

        if(req.body.name) dataset.name = req.body.name;
        if(req.body.desc) dataset.desc = req.body.desc;
        if(req.body.config) dataset.config = req.body.config;
        if(req.body.tags) dataset.tags = req.body.tags;

        dataset.save(function(err) {
            //logger.debug("dateset updated");
            //logger.debug(dataset.toString());
            if(err) return next(err);
            res.json(dataset);
        });
    });
});

/**
 * @apiGroup                    Dataset
 * @api {delete} /dataset/:dataset_id
 *                              Remove registered dataset (only by the user registered it)
 * @apiDescription              Physically remove a dataset registered on DB.
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
router.delete('/:dataset_id', jwt({secret: config.auth.pubkey}), function(req, res, next) {
    var id = req.params.dataset_id;
    db.Datasets.remove({_id: id, user_id: req.user.sub}, function(err) {
        if(err) return next(err);
        res.json({message: "Dataset successfully removed"});
    });
});

module.exports = router;
