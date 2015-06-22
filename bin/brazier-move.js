
'use strict';

var program = require('commander'),
  pkg = require('../package.json'),
  mv = require('../lib/mv'),
  isRoot = require('../lib/isRoot'),
  dieOnError = require('../lib/dieOnError'),
  parseFirebaseUrls = require('../lib/parseFirebaseUrls');

program
.version(pkg.version)
.usage('[-f] <source> <target>')
.arguments('<source> <target>')
.option('--force, -f', 'Allow writing directly to root of a Firebase.')
.action(function(sourceUrl, targetUrl) {

  parseFirebaseUrls([sourceUrl, targetUrl], function(err, refs) {

    dieOnError(err);

    if (isRoot(refs[1]) && !program.force) {
      console.error(refs[1].toString(), 'is a root reference and force flag is not set. Aborting.');
      process.exit(1);
    }

    mv(refs[0], refs[1], function(err) {

      dieOnError(err);
      process.exit(0);

    });

  });

})
.parse(process.argv);
