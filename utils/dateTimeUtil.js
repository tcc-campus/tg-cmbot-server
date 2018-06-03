const moment = require('moment-timezone');

function getDateStringForMonth(month) {
  const dateRange = {};
  switch (month) {
    case 'this_month':
      return moment().startOf('month').tz('Asia/Singapore').format('YYYY-MM');
    case 'next_month':
      return moment().add(1, 'month').startOf('month').tz('Asia/Singapore').format('YYYY-MM');
    default:
      return moment().startOf('month').tz('Asia/Singapore').format('YYYY-MM');
  }
  return null;
}

module.exports = {
  getDateStringForMonth,
};
