const moment = require('moment');

function getDateRangeForThisMonth() {
  return {
    start_date: moment().startOf('month').format('YYYY-MM-DD'),
    end_date: moment().endOf('month').format('YYYY-MM-DD')
  }
}

module.exports = {
  getDateRangeForThisMonth,
}
