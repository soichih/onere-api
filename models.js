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

exports.Projects = mongoose.model('Projects', 
    mongoose.Schema({
        user_id: {type: String, index: true}, //user created this project (PI)
        admins: [ Number ], //list of users who can administer this project (co-PIs?)
        members: [ Number ], //list of users who can access things under this project

        name: String,
        desc: String, 

        config: mongoose.Schema.Types.Mixed, 
        
        /*
        //should this be part of appdata? (need to ask franco)
        publications: [
            {
                title: String,
                authors: [{
                    //type: String, //author / editor / compiler, etc..
                    firstname: String,
                    middlename: String,
                    lastname: String,
                    suffix: String,
                }],
                date: Date, //publish date
                doi: String,
            }
        ],
        */

        create_date: { type: Date, default: Date.now },
    })
);

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.Datasets = mongoose.model('Datasets', 
    mongoose.Schema({
        user_id: {type: String, index: true},
        //gids: [ Number ], //list of auth service group IDs that should have access to this data

        project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},

        name: String, //name of the dataset
        desc: String, 

        //TODO -- not sure what's the best way to store this maybe the _id is good enough.
        //storage: String, //storage system used to store this datase
        //path: String, //location of this dataset within the storage.
        
        //any metadata associated with this dataset (data type, applications to be used for, etc..)
        config: mongoose.Schema.Types.Mixed, 

        create_date: { type: Date, default: Date.now },
    })
);

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.Applications = mongoose.model('Applications', 
    mongoose.Schema({
        user_id: {type: String, index: true},
        //gids: [ Number ], //list of auth service group IDs that should have access to this data

        project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},

        name: String, //user friendly name for this container
        desc: String, 

        //SCA service which will execute this app 
        //(like soichih/sca-service-docker, soichih/sca-service-git)
        //service: String, 

        //configuration for the service
        config: mongoose.Schema.Types.Mixed, 

        create_date: { type: Date, default: Date.now },
    })
);

///////////////////////////////////////////////////////////////////////////////////////////////////

//joins application and data together and becomes a parent of all SCA tasks
var appdatas_schema = mongoose.Schema({
    user_id: {type: String, index: true},

    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},

    application_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Applications'},
    dataset_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Datasets'},

    name: String, 
    desc: String, 

    //config: mongoose.Schema.Types.Mixed, 

    create_date: { type: Date, default: Date.now },
});
appdatas_schema.index({name: 'text', desc: 'text'})
exports.Appdatas = mongoose.model('Appdatas', appdatas_schema);

///////////////////////////////////////////////////////////////////////////////////////////////////


