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
    
    actual = parser.readYml(yamlFile);
    assert.deepEqual(actual, expected);
  });
});
