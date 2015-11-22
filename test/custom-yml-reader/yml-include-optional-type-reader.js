'use strict';

var assert = require('assert');
var yaml = require('js-yaml');
var fs = require('fs');
var parser = require('../../lib/custom-yml-reader');

suite('Include Files - Optional', function() {
  test('should include optional files', function () {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/include-optional/include-main-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-optional/include-main-test-expected.json'), 'utf8'));

    //set undefined property as JSON parser doesnt have the undefined for "my-nested-not-exists" which
    // assert.deepEquals will check against the property being on the object but just as undefined
    expected["my-nested-not-exists"] = undefined
    
    actual = parser.readYml(yamlFile);
    assert.deepEqual(actual, expected);
  });
});
