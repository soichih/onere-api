'use strict';

//contrib
var mongoose = require('mongoose');
var winston = require('winston');

//mine
var config = require('./config');
var logger = new winston.Logger(config.logger.winston);

if(config.debug) {
    mongoose.set('debug', true);
}

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


/*
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
*/

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.Datasets = mongoose.model('Datasets', 
    mongoose.Schema({
        user_id: {type: String, index: true},
        gids: [ Number ], //list of auth service group IDs that should have access to this data

        name: String, //name of the dataset

        storage: String, //storage system used to store this datase
        path: String, //location of this dataset with in the storage.
        
        //any metadata associated with this dataset (data type, applications to be used for, etc..)
        config: mongoose.Schema.Types.Mixed, 

        create_date: { type: Date, default: Date.now },
    })
);

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.Applications = mongoose.model('Applications', 
    mongoose.Schema({
        user_id: {type: String, index: true},
        
        //application is open to everyone
        //gids: [ Number ], //list of auth service group IDs

        name: String, //user friendly name for this container

        container_url: String, //name of the container ("myrepo:5000/registry-demo")

        //any metadata associated with this container (TODO..)
        config: mongoose.Schema.Types.Mixed, 

        create_date: { type: Date, default: Date.now },
    })
);



