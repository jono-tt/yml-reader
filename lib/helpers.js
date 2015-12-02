'use strict';

var _ = require('lodash');

//Remove any values which are "undefined" or "NULL"
var cleanupObject = function(value) {
  if (_.isArray(value)) {
    value = _.compact(value);

    _.each(value, function(val, index) {
      value[index] = cleanupObject(val);
    });

    return value;
  } else if(_.isObject(value)) {
    _.each(value, function(val, name) {
      if(_.isNull(val) || _.isUndefined(val)) {
        delete value[name];
      } else {
        value[name] = cleanupObject(val);
      }
    });

    return value;
  } else {
    return value;
  }
}

module.exports = {
  cleanupObject: cleanupObject
};
