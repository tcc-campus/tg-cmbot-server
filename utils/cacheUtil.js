let cacheProvider = require('../cache/cacheProvider');

const CALLBACK_QUERY_TYPE = {
  UPCOMING_MONTH: 'upcoming_month_callback_query',
  UPCOMING_EVENT_DETAIL: 'upcoming_event_detail_callback_query',
}

function getCacheObj(cacheKey) {
  console.log("Getting cache value object with cache key: " + cacheKey);
  return cacheProvider.instance().get(cacheKey);
}

module.exports = {
  CALLBACK_QUERY_TYPE,
  getCacheObj,
}
