
'use strict';

var program = require('commander'),
  pkg = require('../package.json'),
  cp = require('../lib/cp'),
  isRoot = require('../lib/isRoot'),
  dieOnError = require('../lib/dieOnError'),
  parseFirebaseUrls = require('../lib/parseFirebaseUrls');

program
.version(pkg.version)
.usage('[-n] <source> <target>')
.arguments('<source> <target>')
.option('-n, --no-clobber', 'Don\'t clobber existing values.')
.option('-f, --force', 'Allow writing directly to root of a Firebase.')
.action(function(sourceUrl, targetUrl) {

  parseFirebaseUrls([sourceUrl, targetUrl], function(err, refs) {

    dieOnError(err);

    if (isRoot(refs[1]) && !program.force) {
      console.error(refs[1].toString(), 'is a root reference and force flag is not set. Aborting.');
    }

    cp(refs[0], refs[1], function(err) {

      dieOnError(err);
      process.exit(0);

    }, program.clobber);

  }, program.force);

})
.parse(process.argv);
