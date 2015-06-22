
'use strict';

describe('parseFirebaseUrls', function() {

  var parseFirebaseUrls = require('../../lib/parseFirebaseUrls');

  it('calls back with firebase refs for each of the input URLs', function(done) {

    parseFirebaseUrls([
      'https://11111.firebaseio-demo.com/foo',
      'https://22222.firebaseio-demo.com/bar'
    ], function(err, refs) {

      expect(refs[0].child).toBeDefined();
      expect(refs[1].child).toBeDefined();
      expect(refs[0].toString()).toEqual('https://11111.firebaseio-demo.com/foo');
      expect(refs[1].toString()).toEqual('https://22222.firebaseio-demo.com/bar');
      done();
    });

  });

  it('resolves subsequent URLs relative to the first URL', function(done) {

    parseFirebaseUrls([
      'https://11111.firebaseio-demo.com/foo',
      '/bar',
      'baz'
    ], function(err, refs) {

      expect(refs[1].toString()).toEqual('https://11111.firebaseio-demo.com/bar');
      expect(refs[2].toString()).toEqual('https://11111.firebaseio-demo.com/baz');
      done();

    });

  });

  it('calls back with an error if any of the input URLs is invalid', function(done) {

    parseFirebaseUrls([
      'https://11111.firebaseiocom/foo',
    ], function(err) {
      expect(err).not.toBe(null);
      expect(err).not.toBe(undefined);
      done();
    });

  });

  it('authenticates each ref according to the auth section of the URL', function(done) {

    parseFirebaseUrls([
      'https://' + process.env.FIREBASE_TEST_SECRET + '@' + process.env.FIREBASE_TEST_URL,
      'https://11111.firebaseio-demo.com/foo'
    ], function(err, refs) {
      expect(err).toBe(null);
      expect(refs[0].getAuth()).not.toBe(null);
      done();
    });

  });

  it('calls back with an error if an authentication failed', function(done) {

    parseFirebaseUrls([
      'https://11111.firebaseio-demo.com/foo',
      'https://wrong@' + process.env.FIREBASE_TEST_URL
    ], function(err, refs) {
      expect(err).not.toBe(null);
      expect(err).not.toBe(undefined);
      done();
    });

  });

});
