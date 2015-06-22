
'use strict';

var extend = require('extend');

module.exports = function cp(source, target, cb, overwrite) {

  var sourceSnap, targetSnap, hadErr = false;

  function sumUp(err, newSourceSnap, newTargetSnap) {

    if (err) {
      hadErr = true;
      cb(err);
    }

    if (newSourceSnap) {
      sourceSnap = newSourceSnap;
    }

    if (newTargetSnap) {
      targetSnap = newTargetSnap;
    }

    if (sourceSnap && targetSnap && !hadErr) {

      try {

        var sourceVal = sourceSnap.exportVal(),
          targetVal = targetSnap.exportVal(),
          result;

        if (overwrite) {
          result = extend(true, {}, targetVal, sourceVal);
        } else {
          result = extend(true, {}, sourceVal, targetVal);
        }

        target.set(result, cb);

      } catch(e) {
        cb(e);
      }

    }

  }

  source.once('value', function(snap) {
    sumUp(null, snap, null);
  }, sumUp);

  target.once('value', function(snap) {
    sumUp(null, null, snap);
  }, sumUp);

};
