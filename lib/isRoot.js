
'use strict';

module.exports = function(ref) {
  return ref.root().toString() === ref.toString();
};
