
'use strict';

var Firebase = require('firebase');
var mv = require('../../lib/mv');


describe('mv', function() {

  var root;

  beforeEach(function(done) {

    root = new Firebase('brazier-mv-spec.firebaseio-demo.com');
    root.set({
      source: {
        a: 1,
        b: ['foo'],
        c: {
          bells: true,
          whistles: true
        }
      },
      target: {
        a: 2,
        b: ['bar', 'baz', 'quux'],
        c: {
          bells: false
        }
      }
    }, done);

  });

  it('moves data recursively from one ref to another', function(done) {

    mv(root.child('source'), root.child('target'), function(err) {

      expect(err).toBe(null);

      root.child('target')
      .once('value', function(snap) {

        expect(snap.val()).toEqual({
          a: 1,
          b: ['foo', 'baz', 'quux'],
          c: {
            bells: true,
            whistles: true
          }
        });

        root.child('source')
        .once('value', function(snap) {
          expect(snap.val()).toBe(null);
          done();
        }, done);

      }, done);

    });

  });

  // TODO(goldibex): use a real Firebase so we can test the behavior of mv on failure
  // i.e., that it doesn't delete existing data if the copy failed
  
});
