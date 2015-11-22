#!/usr/bin/env node
'use strict';

// stdlib
var fs    = require('fs');
var path = require('path');

// 3rd-party
var argparse = require('argparse');
var yaml = require('js-yaml');
var _ = require('lodash');

// internal
var reader = require('..');

////////////////////////////////////////////////////////////////////////////////
var cli = new argparse.ArgumentParser({
  prog:     'yml-reader',
  version:  require('../package.json').version,
  addHelp:  true
});

cli.addArgument([ '-d', '--dir' ], {
  help:   'Directory to start relative file linking from. Defaults as current(.)',
  defaultValue: '.',
  nargs:  '?'
});

cli.addArgument([ '-e', '--env' ], {
  help:   'Environment variables to use to pass through to yml parser',
  nargs:  '?',
  action: 'append'
});

cli.addArgument([ '-u', '--uglify' ], {
  help:   'Output in uglyfied JSON string',
  action: 'storeTrue'
});

cli.addArgument([ '-y', '--to-yaml' ], {
  help:   'Output in yaml',
  action: 'storeTrue'
});

cli.addArgument([ '-s', '--split-yaml-root-array' ], {
  help:   'Split YML output array into sub yaml items separated by this string',
  nargs:  '*'
});

cli.addArgument([ 'file' ], {
  help:   'File to read, utf-8 encoded without BOM. Use - for std in',
  nargs:  '?',
  defaultValue: '-'
});
////////////////////////////////////////////////////////////////////////////////


var options = cli.parseArgs();
////////////////////////////////////////////////////////////////////////////////

function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin
    var chunks = [];

    process.stdin.on('data', function (chunk) {
      chunks.push(chunk);
    });

    setTimeout(function() {
      if(chunks.length == 0) {
        console.error("Use CTRL-D to end input");

        setTimeout(function() {
          if(chunks.length == 0) {
            callback({message: "Timeout reading stdin"});
          }
        }, 10000);
      }
    }, 1000);

    process.stdin.on('end', function () {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}

readFile(options.file, 'utf8', function (error, input) {
  var output, inFile;

  if (error) {
    if (error.code === 'ENOENT') {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(
      options.trace && error.stack ||
      error.message ||
      String(error));

    process.exit(1);
  }

  if (options.file === "-") {
    // Using std in, set aa fake file to start processing from
    inFile = path.resolve(options.dir, "stdin.tmp");
  } else {
    inFile = path.resolve(options.file);
  }

  //check the env vars
  if (options.env && options.env.length) {
    for (var i = 0; i < options.env.length; i++) {
      var vars = options.env[i].split("=");
      process.env[vars[0]] = vars[1];
    }
  }

  try {
    output = reader.readYmlByString(input, inFile);
  } catch (error) {
    console.error(
      options.trace && error.stack ||
      error.message ||
      String(error)
    );

    process.exit(1);
  }

  if (options.to_yaml) {
    //print in YAML
    if (_.isArray(output) && options.split_yaml_root_array) {
      var split = options.split_yaml_root_array.length ? options.split_yaml_root_array[0] : "---";

      for (var i = 0; i < output.length; i++) {
        console.log(yaml.dump(output[i]));

        if (i < (output.length-1)) {
          //not the last item so add a separator
          console.log(split);
        }
      }
    } else {
      console.log(yaml.dump(output));
    }
  } else if (options.uglify) {
    //Uglify JSON
    console.log(JSON.stringify(output));
  } else {
    //Pretty print JSON
    console.log(JSON.stringify(output, null, '  '));
  }

  process.exit(0);
});
