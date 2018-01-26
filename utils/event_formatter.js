const moment = require('moment');

function formatEventList(eventList) {
  console.log("Formatting Event List");
  let formattedEventList = [];
  for (var i = 0; i < eventList.length; i++) {
    var startDateTimeObj = moment(eventList[i].start.dateTime);
    var endDateTimeObj = moment(eventList[i].end.dateTime);
    formatEventList.push({
      event_name: eventList[i].summary,
      event_message: eventList[i].description,
      event_location: eventList[i].location,
      event_date: startDateTimeObj.format("dddd, DD MMM YYYY"),
      event_timing: {
        start_time: startDateTimeObj.format("h:mm a"),
        end_time: endDateTimeObj.format("h:mm a"),
      }
    })
  }
}

module.exports = {
  formatEventList,
}
