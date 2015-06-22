
'use strict';

var Firebase = require('firebase');
var cp = require('../../lib/cp');

describe('cp', function() {

  var root;
  beforeEach(function(done) {

    root = new Firebase('brazier-cp-spec.firebaseio-demo.com');

    root.set({
      prisonCells: {
        lotr: {
          state: 'agitated',
          names: ['Sam', 'Frodo'],
          eyeOfSauron: 'nearby'
        },
        starwars: {
          state: 'blase',
          block: 1138,
          names: ['Luke', 'Leia', 'Han', 'Chewie', 'garbage alien']
        },
        goldfinger: {
          state: 'singed',
          names: 'Bond, James Bond'
        }
      }
    }, done);

  });

  it('copies data from one ref to another without overwriting existing values', function(done) {

    cp(root.child('prisonCells/starwars'), root.child('prisonCells/lotr'), function(err) {

      if (err) {
        done(err);
      } else {

        root.child('prisonCells/lotr')
        .once('value', function(snap) {

          expect(snap.val()).toEqual({
            state: 'agitated',
            eyeOfSauron: 'nearby',
            names: ['Sam', 'Frodo', 'Han', 'Chewie', 'garbage alien'],
            block: 1138
          });

          done();

        }, done);

      }

    });

  });

  it('optionally copies data and overwrites', function(done) {

    cp(root.child('prisonCells/lotr'), root.child('prisonCells/starwars'), function(err) {

      if (err) {
        done(err);
      } else {

        root.child('prisonCells/starwars')
        .once('value', function(snap) {

          expect(snap.val()).toEqual({
            state: 'agitated',
            block: 1138,
            eyeOfSauron: 'nearby',
            names: ['Sam', 'Frodo', 'Han', 'Chewie', 'garbage alien']
          });
          done();

        }, done);

      }

    }, true);

  });

});
