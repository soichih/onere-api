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

// var entriesSchema = mongoose.Schema({
//
//     owner_user_id: String,
//
//     name: String,
//     desc: String,
//
//     container_name: String,
//
//     create_date: Date,
// });
// exports.Entries = mongoose.model('Entries', entriesSchema);


var entriesSchema = mongoose.Schema({

    task_id: Number,
    name: String,
    desc: String,
    user_id: String,
    created_date: Date,
    status: String,
    host: String,
    working_dir: String,
    app_name: String,
    product:{
        input:{
            name:String,
            location: String
        },
        output:{
            name:String,
            location: String 
        }
    },
    container:{
        id: String,
        location: String,
        dependency: {
            appname: String,
            version: String
        }
    }
        
});
exports.Entries = mongoose.model('Entries', entriesSchema);

