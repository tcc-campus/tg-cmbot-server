const moment = require('moment');

function getDateRangeForMonth(month) {
  let dateRange = {};
  switch (month) {
    case 'this_month':
      dateRange = {
        start_date: moment().startOf('month').format('YYYY-MM-DD'),
        end_date: moment().endOf('month').format('YYYY-MM-DD')
      }
      break;
    case 'next_month':
      dateRange = {
        start_date: moment().add(1, 'month').startOf('month').format('YYYY-MM-DD'),
        end_date: moment().add(1, 'month').endOf('month').format('YYYY-MM-DD')
      }
      break;
    default:
      dateRange = {
        start_date: moment().startOf('month').format('YYYY-MM-DD'),
        end_date: moment().endOf('month').format('YYYY-MM-DD')
      }
      break;
  }
  return dateRange;
}

module.exports = {
  getDateRangeForMonth,
}
