
'use strict';

var fs = require('fs'),
  program = require('commander'),
  pkg = require('../package.json'),
  dieOnError = require('../lib/dieOnError'),
  parseFirebaseUrls = require('../lib/parseFirebaseUrls');

program
.version(pkg.version)
.arguments('<source>')
.option('-o, --output-path <path>', 'Path to save output on (as <childPath>.json)')
.action(function(sourceUrl) {

  parseFirebaseUrls([sourceUrl], function(err, refs) {

    dieOnError(err);

    var buffer = '',
      opsInFlight = 0,
      flushedLoc = '';

    function handle(str) {

      var locs = (flushedLoc + str).split(/\s+/);
      flushedLoc = locs.pop();

      locs.forEach(function(loc) {

        if (loc.length < 1) {
          return;
        }

        opsInFlight++;
        refs[0].child(loc).once('value', function(snap) {
          var result = JSON.stringify(snap.exportVal(), undefined, 2);

          if (program.outputPath) {

            fs.writeFile(program.outputPath + '/' + loc, result, function(err) {
              if (err) {
                console.error(err.message);
              }
              opsInFlight--;
            });

          } else {

            console.log(result);
            opsInFlight--;

          }

        });

      });

    }

    process.stdin
    .on('data', handle)
    .on('error', dieOnError)
    .on('end', function() {

      handle('');

      setInterval(function() {

        if (opsInFlight === 0) {
          process.exit(0);
        }

      }, 250);

    });

  }, true);

})
.parse(process.argv);
