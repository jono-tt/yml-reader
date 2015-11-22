var fs = require('fs');
var path = require('path');

function EnvType(reader) {
  this.reader = reader;
}

EnvType.prototype.resolve = function (name) {
  if (name) {
    return true;
  } else {
    return false;
  }
}

EnvType.prototype.construct = function (name) {
  var reader = this.reader;

  if(name.indexOf('{{') >= 0) {
    return name.replace(/\{\{([^\}]*)\}\}/g, function(match, name) {
      return reader.doEnvReplacement(name);
    });
  } else {
    return reader.doEnvReplacement(name);
  }
}

EnvType.prototype.represent = function (inc) {
  return null;
}

EnvType.prototype.getReaderConfig = function() {
  return {
    kind: 'scalar',
    resolve: this.resolve.bind(this),
    construct: this.construct.bind(this),
    represent: this.represent.bind(this)
  }
}

module.exports = EnvType;
