#!/usr/bin/env node
var serialize = require('node-serialize'),
    getopt = require('node-getopt'),
    fs = require('fs');

// Constants
const ERROR_LOG_PREFIX = "[cloudpipe] ";
const ERROR_EXIT_CODE = -1;

// Read result file path from arg
opt = getopt.create([
  [ 'r', 'result-file=ARG', 'path to the result file' ],
  [ 'h', 'help',            'display this help' ]
])
  .bindHelp()
  .parseSystem();

var resultFile = opt.options['result-file'];

// Make sure resultFile is specified
if (!resultFile) {
  // For now, spit out error to STDERR even though it will show up
  // for the end-user. Also, exit with a fixed non-success code
  process.stderr.write(ERROR_LOG_PREFIX + 'Path to the result file was not specified');
  process.exit(ERROR_EXIT_CODE);
}

// TODO: recursively create dirs in resultFile if necessary

// Read payload from STDIN
var payload = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    payload += chunk;
  }
});

process.stdin.on('end', function() {
  // Deserialize payload
  payload = serialize.unserialize(payload); // base64 decoding is already done
  
  // Determine function to run and arguments
  var f = payload.f;
  var args = []
  for (argIndex in payload.args) {
    args.push(payload.args[argIndex]);
  }

  // TODO: determine globals
  // TODO: determine packages

  // TODO: This line is not working and emits this error:
  // $ echo '{"f":"_$$ND_FUNC$$_function (x, y, callback) {\n    callback(null, x + y);\n}","options":{},"args":{"0":2,"1":4,"2":"_$$ND_FUNC$$_function (err, result) {\n  // err == null\n  // result == 6\n}"}}' | node bin/runner.js --result-file ./.result
  // undefined:2
  //     callback(null, x + y);
  //     ^
  // TypeError: undefined is not a function
  var result = f.apply(null, args);

  // Write result to resultFile
  fs.writeFile(resultFile, result, function(err) {

    if (err) {
      process.stderr.write(ERROR_LOG_PREFIX + 'Could not write result file');
      process.exit(ERROR_EXIT_CODE);
    }
  });
});
