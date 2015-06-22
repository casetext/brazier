
'use strict';

var url = require('url'),
  Firebase = require('firebase');

var hasHostname = /^(https?:\/\/)?[0-9a-z]([0-9a-z\-]{0,61}[0-9a-z])?(\.[0-9a-z](0-9a-z\-]{0,61}[0-9a-z])?)+/;

module.exports = function parseFirebaseUrls(urls, callback) {

  if (urls.length === 0) {

    setImmediate(function() {
      callback(null, []);
    });
    return;

  }

  var sourceUrl = urls[0],
    targetUrls = urls.slice(1);

  var parsedSource = url.parse(sourceUrl);

  if (!parsedSource.hostname) {

    setImmediate(function() {
      callback(new Error('Source URL must include a hostname'));
    });

    return;

  }

  var allParsedUrls = [parsedSource]
  .concat(targetUrls.map(function(targetUrl) {

    if (!targetUrl.match(hasHostname)) {
      targetUrl = url.resolve(sourceUrl, targetUrl);
    }

    var parsedTarget = url.parse(targetUrl);
    return url.parse(targetUrl);

  }));

  var refs = [],
    haveAuthed = {},
    needAuthCount = 0,
    haveAuthCount = 0,
    gotErr = false;

  var gotAuthBack = function(err) {

    haveAuthCount++;
    if (err) {

      gotErr = true;
      refs.forEach(function(ref) {
        ref.unauth();
      });
      callback(err, []);

    }

    if (needAuthCount === haveAuthCount && !gotErr) {
      callback(null, refs);
    }

  };

  var error = null;

  allParsedUrls.forEach(function(parsedUrl) {

    var ref;
    try {

      ref = new Firebase(url.format({
        protocol: 'https:',
        hostname: parsedUrl.hostname,
        pathname: parsedUrl.pathname
      }));

      if (parsedUrl.auth && !haveAuthed[parsedUrl.hostname]) {
        needAuthCount++;
        haveAuthed[parsedUrl.hostname] = true;
        ref.authWithCustomToken(parsedUrl.auth, gotAuthBack);
      }

      refs.push(ref);

    } catch(e) {
      error = e;
      gotErr = true;
    }

  });

  if (needAuthCount === 0) {
    // no auth was required, call back
    setImmediate(function() {
      callback(error, refs);
    });
  }

};
