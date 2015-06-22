
'use strict';

var program = require('commander'),
  pkg = require('../package.json'),
  dieOnError = require('../lib/dieOnError'),
  parseFirebaseUrls = require('../lib/parseFirebaseUrls');

program
.version(pkg.version)
.arguments('<source> [data...]')
.option('--force, -f', 'Allow writing directly to root of a Firebase.')
.action(function(sourceUrl) {

  parseFirebaseUrls([sourceUrl], function(err, refs) {

    dieOnError(err);
    var data = '';

    process.stdin
    .on('data', function(str) {
      data += str;
    })
    .on('error', dieOnError)
    .on('end', function() {

      var jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch(e) {
        dieOnError(e);
      }

      refs[0].set(jsonData, function(err) {
        dieOnError(err);
        process.exit(0);
      });

    });

  }, program.force);

})
.parse(process.argv);
