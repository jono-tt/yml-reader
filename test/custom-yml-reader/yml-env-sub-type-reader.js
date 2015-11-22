'use strict';

var assert = require('assert');
var yaml = require('js-yaml');
var fs = require('fs');
var parser = require('../../lib/custom-yml-reader');

suite('Env Substitutions', function() {
  test('should substitute environment variables', function() {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/env/substitute-env-var-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/env/substitute-env-var-test-expected.json'), 'utf8'));

    process.env["MY_SERVICE_HOST"] = "Test Host";
    actual = parser.readYml(yamlFile);  
    assert.deepEqual(actual, expected);
  });

  test('should error when environment variable not found', function() {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/env/substitute-env-var-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/env/substitute-env-var-test-expected.json'), 'utf8'));

    delete process.env["MY_SERVICE_HOST"];

    assert.throws(function() {
      parser.readYml(yamlFile);  
    }, Error, "Unable to find ENV Variable 'MY_SERVICE_HOST'");

  });

});
