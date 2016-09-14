'use strict';

//contrib
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

//mine
var config = require('../config');

/**
 * @apiGroup System
 * @api {get} /health Get API status
 * @apiDescription Get current API status
 * @apiName GetHealth
 *
 * @apiSuccess {String} status 'ok' or 'failed'
 */
router.get('/health', function(req, res) {
    res.json({status: 'ok'});
});

router.use('/project', require('./project'));
router.use('/dataset', require('./dataset'));
router.use('/application', require('./application'));
router.use('/appdata', require('./appdata'));

module.exports = router;

