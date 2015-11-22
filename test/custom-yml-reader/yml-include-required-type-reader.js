'use strict';

var assert = require('assert');
var yaml = require('js-yaml');
var fs = require('fs');
var parser = require('../../lib/custom-yml-reader');

suite('Include Files - Required', function() {
  test('should include deep nested yml', function () {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/include-required/include-main-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-required/include-main-test-expected.json'), 'utf8'));

    actual = parser.readYml(yamlFile);  
    assert.deepEqual(actual, expected);
  });

  test('should include with substituted ENV variable', function () {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test-expected.json'), 'utf8'));

    //Set the ENVIRONMENT ENV property
    process.env["ENVIRONMENT"] = "staging";

    actual = parser.readYml(yamlFile);  
    assert.deepEqual(actual, expected);
  });

  test('should error when env variable not found', function () {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test.yml'),
      expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/include-required/sub-env-var-main-test-expected.json'), 'utf8'));

    //delete the ENVIRONMENT ENV property
    delete process.env["ENVIRONMENT"];

    assert.throws(function() {
      parser.readYml(yamlFile);  
    }, Error, "Should not be able to find ENV variable");
  });

  test('should error when include not found', function () {
    var path = require('path'),
      actual   = null,
      yamlFile = path.resolve(__dirname, 'fixtures/include-required/error-include-not-exists-test.yml');

    assert.throws(function() {
      parser.readYml(yamlFile);
    }, Error, "Should not find the include file");
  });
});
