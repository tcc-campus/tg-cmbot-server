let cacheProvider = require('../cache_provider');

const REPLY_TYPE = {
  FEEDBACK: 'feedback_reply',
}

const CALLBACK_QUERY_TYPE = {
  UPCOMING_MONTH: 'upcoming_month_callback_query'
}

function getCacheObj(cacheKey) {
  console.log("Getting cache value object with cache key: " + cacheKey);
  return cacheProvider.instance().get(cacheKey);
}

module.exports = {
  REPLY_TYPE,
  CALLBACK_QUERY_TYPE,
  getCacheObj,
}
