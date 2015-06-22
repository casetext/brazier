
'use strict';

module.exports = function die(err) {

  if (err) {
    console.error(err.message || err);
    process.exit(1);
  }

};

