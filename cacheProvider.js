let nodeCache = require('node-cache');
let cache = null;

exports.start = function(done) {
  console.log("Starting cache provider.");
  if (cache) return done();

  cache = new nodeCache();
}

exports.instance = function() {
  return cache;
}
