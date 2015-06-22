
'use strict';

var program = require('commander'),
  pkg = require('../package.json'),
  parseFirebaseUrls = require('../lib/parseFirebaseUrls'),
  dieOnError = require('../lib/dieOnError');

program
.version(pkg.version)
.arguments('<source>')
.action(function(sourceUrl) {

  parseFirebaseUrls([sourceUrl], function(err, refs) {

    dieOnError(err);
    refs[0].once('value', function(snap) {

      console.log(JSON.stringify(snap.exportVal(), undefined, 2));
      process.exit(0);

    }, dieOnError);

  }, true);

})
.parse(process.argv);
