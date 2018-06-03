const is = require('is_js');
const NodeCache = require('node-cache');

const cache = {};

function start() {
  console.log('Starting cache provider.');

  if (is.empty(cache)) {
    cache.events = new NodeCache();
    cache.dates = new NodeCache();
    cache.users = new NodeCache();
    cache.general = new NodeCache();
  }
}

function getInstance() {
  return cache;
}

module.exports = {
  start,
  getInstance,
};
