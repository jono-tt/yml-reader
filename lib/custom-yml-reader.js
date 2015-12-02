'use strict';

var util = require('util');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var Helpers = require('./helpers.js');
var IncludeType = require('./types/include-type.js');
var EnvType = require('./types/env-type.js');
var SCHEMAS = null;

var reader = {
  visitPath: [],

  getCurrentFile: function() {
    return this.visitPath[0];
  },

  readYml: function(filePath) {
    return this.readYmlByString(fs.readFileSync(filePath, { encoding: 'utf8' }), filePath);
  },

  readYmlByString: function(input, path) {
    var retVals = [];
    var yamlConfs = input.split(/^---.*/m);
    this.visitPath.unshift(path);

    for(var i = 0; i < yamlConfs.length; i++) {
      var retVal = yaml.safeLoad(yamlConfs[i], {
        filename: path,
        schema: SCHEMAS
      });
      
      retVals.push(Helpers.cleanupObject(retVal));
    }

    this.visitPath.shift();
    return retVals.length == 1 ? retVals[0] : retVals;
  },

  doEnvReplacement: function(name) {
    name = name.replace(/\s/g, "");

    if(process.env[name]) {
      return process.env[name];
    } else {
      throw new Error("Unable to find ENV Variable '" + name + "'");
    }
  }
}

SCHEMAS = yaml.Schema.create([
  //Include file and fail if the file does not exist
  new yaml.Type('!include', new IncludeType(true, reader).getReaderConfig()),

  //Include file if the file exists
  new yaml.Type('!include?', new IncludeType(false, reader).getReaderConfig()),

  new yaml.Type('!env', new EnvType(reader).getReaderConfig())
]);

module.exports = reader;
