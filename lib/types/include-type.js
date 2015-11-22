var fs = require('fs');
var path = require('path');

function IncludeType(required, reader) {
  this.isRequired = required;
  this.reader = reader;
}

IncludeType.prototype.resolve = function (url) {
  if (url) {
    return true;
  } else {
    return false;
  }
}

IncludeType.prototype.construct = function (url) {
  var reader = this.reader;
  var currentFile = this.reader.getCurrentFile();
  url = url.replace(/\{\{([^\}]*)\}\}/g, function(match, name) {
    return reader.doEnvReplacement(name);
  });

  var includeFile = path.resolve(currentFile, '..', url);

  //Only try read file if it's required or otherwise if it exists
  if(this.isRequired || fs.existsSync(includeFile.toString())) {
    return this.reader.readYml(includeFile);
  } else {
    return undefined;
  }
}

IncludeType.prototype.represent = function (inc) {
  return null;
}

IncludeType.prototype.getReaderConfig = function() {
  return {
    kind: 'scalar',
    resolve: this.resolve.bind(this),
    construct: this.construct.bind(this),
    represent: this.represent.bind(this)
  }
}

module.exports = IncludeType;
