'use strict';


var path = require('path');
var fs   = require('fs');

suite('Custom YML Reader', function () {
  var directory = path.resolve(__dirname, 'custom-yml-reader');

  fs.readdirSync(directory).forEach(function (file) {
    if ('.js' === path.extname(file)) {
      require(path.resolve(directory, file));
    }
  });
});
