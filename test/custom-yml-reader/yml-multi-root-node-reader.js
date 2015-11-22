'use strict';

var assert = require('assert');
var yaml = require('js-yaml');
var fs = require('fs');
var parser = require('../../lib/custom-yml-reader');

suite('Multiple Root Nodes', function() {
  test('should allow multiple yml root entries split by ^---.* on multilines', function() {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/multi-root-nodes/multi-root-item-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/multi-root-nodes/multi-root-item-test.json'), 'utf8'));

    actual = parser.readYml(yamlFile);  
    assert.deepEqual(actual, expected);
  });
});
