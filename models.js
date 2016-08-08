'use strict';

//contrib
var mongoose = require('mongoose');
var winston = require('winston');

//mine
var config = require('./config');
var logger = new winston.Logger(config.logger.winston);

mongoose.set('debug', true);

exports.init = function(cb) {
    mongoose.connect(config.mongodb, {}, function(err) {
        if(err) return cb(err);
        logger.info("connected to mongo");
        cb();
    });
}
exports.disconnect = function(cb) {
    mongoose.disconnect(cb);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

var entriesSchema = mongoose.Schema({

    owner_user_id: String,

    name: String,
    desc: String,

    container_name: String, 

    create_date: Date,
});
exports.Entries = mongoose.model('Entries', entriesSchema);

