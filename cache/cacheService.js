const cacheProvider = require('./cacheProvider');

const CACHE_TABLE = {
  EVENTS: 'events',
  DATES: 'dates',
  USERS: 'users',
  GENERAL: 'general',
};

function set(table, key, value, ttl) {
  return new Promise((resolve, reject) => {
    if (key) {
      const TTL_OPTIONS = ttl ? { ttl } : {};
      cacheProvider.getInstance()[table].set(key, value, TTL_OPTIONS, (err) => {
        if (err) {
          reject(new Error(`Unable to set cache for key: ${key} => Err: ${err}`));
        } else {
          resolve(`Cache updated for: ${key}`);
        }
      });
    } else {
      reject(new Error('No cache key given.'));
    }
  });
}

function get(table, key) {
  return new Promise((resolve, reject) => {
    cacheProvider.getInstance()[table].get(key, (err, result) => {
      if (err) {
        reject(new Error(`Unable to get cache value for key: ${key} => Err: ${err}`));
      } else if (result) {
        console.log(`Got cache value for key: ${key}`);
        resolve(result);
      } else {
        reject(new Error(`Unable to get cache value for key: ${key} => Err: No Value`))
      }
    });
  });
}

function del(table, key) {
  return new Promise((resolve, reject) => {
    cacheProvider.getInstance()[table].del(key, (err) => {
      if (err) {
        reject(new Error(`Unable to delete cache for key: ${key} => Err: ${err}`));
      } else {
        resolve(`Cache deleted for key: ${key}`);
      }
    });
  });
}

module.exports = {
  cacheTables: CACHE_TABLE,
  set,
  del,
  get,
};
