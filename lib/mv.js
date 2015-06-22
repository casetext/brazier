
'use strict';

var cp = require('./cp');

module.exports = function(source, target, cb) {

  cp(source, target, function(err) {

    if (err) {
      cb(err);
    } else {
      source.remove(cb);
    }

  }, true);

};
