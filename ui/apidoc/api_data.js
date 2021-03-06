define({ "api": [
  {
    "group": "Application",
    "type": "delete",
    "url": "/application/:application_id",
    "title": "Remove registered application (only by the user registered it)",
    "description": "<p>Physically remove an application registered on DB.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Application",
    "name": "DeleteApplicationApplication_id"
  },
  {
    "group": "Application",
    "type": "post",
    "url": "/application",
    "title": "Post Application",
    "description": "<p>Register new application</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User friendly name for this app</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Description for this app</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "service",
            "description": "<p>Name of SCA service that contains this app (soichih/sca-service-docker, for example)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>Application installed and how it's configured, etc..</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Application",
            "description": "<p>record registered</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Application",
    "name": "PostApplication"
  },
  {
    "group": "Application",
    "type": "put",
    "url": "/application/:application_id",
    "title": "Put Application",
    "description": "<p>Update Application</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>User friendly name for this app</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "desc",
            "description": "<p>Description for this app</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "service",
            "description": "<p>Name of SCA service that contains this app (soichih/sca-service-docker, for example)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "config",
            "description": "<p>Config for this app</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Application",
            "description": "<p>object updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Application",
    "name": "PutApplicationApplication_id"
  },
  {
    "group": "Dataset",
    "type": "delete",
    "url": "/dataset/:dataset_id",
    "title": "Remove registered dataset (only by the user registered it)",
    "description": "<p>Physically remove a dataset registered on DB.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Dataset",
    "name": "DeleteDatasetDataset_id"
  },
  {
    "group": "Dataset",
    "type": "get",
    "url": "/dataset",
    "title": "Query datasets",
    "description": "<p>Query applications registered</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "find",
            "description": "<p>Optional Mongo find query - defaults to {}</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>Optional Mongo sort object - defaults to {}</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "select",
            "description": "<p>Optional Fields to load - defaults to 'logical_id'</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Optional Maximum number of records to return - defaults to 100</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Optional Record offset for pagination</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Dataset",
    "name": "GetDataset"
  },
  {
    "group": "Dataset",
    "type": "post",
    "url": "/dataset",
    "title": "Post Dataset",
    "description": "<p>Register new dataset</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User friendly name for this container</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Description for this dataset</p> <p>// * @apiParam {String} storage Name of the storage system used // * @apiParam {String} path    Path where the .tar.gz is stored on above storage</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>Metadata for this dataset (TODO..)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Dataset",
            "description": "<p>record registered</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Dataset",
    "name": "PostDataset"
  },
  {
    "group": "Dataset",
    "type": "put",
    "url": "/dataset/:dataset_id",
    "title": "Put Dataset",
    "description": "<p>Update dataset</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>User friendly name for this container</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "desc",
            "description": "<p>Description for this dataset</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>Metadata for this dataset (TODO..)</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Dataset",
            "description": "<p>object updated</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Dataset",
    "name": "PutDatasetDataset_id"
  },
  {
    "group": "Service",
    "type": "get",
    "url": "/application",
    "title": "Query Applications",
    "description": "<p>Query applications registered</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "find",
            "description": "<p>Optional Mongo find query - defaults to {}</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>Optional Mongo sort object - defaults to {}</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "select",
            "description": "<p>Optional Fields to load - defaults to 'logical_id'</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Optional Maximum number of records to return - defaults to 100</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Optional Record offset for pagination</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>A valid JWT token &quot;Bearer: xxxxx&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "resources",
            "description": "<p>Resource detail</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "Service",
    "name": "GetApplication"
  },
  {
    "type": "get",
    "url": "/health",
    "title": "Get current service status",
    "name": "Health",
    "group": "System",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>'ok' or 'failed'</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers.js",
    "groupTitle": "System"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./ui/apidoc/main.js",
    "group": "_usr_local_git_onere_api_ui_apidoc_main_js",
    "groupTitle": "_usr_local_git_onere_api_ui_apidoc_main_js",
    "name": ""
  }
] });
