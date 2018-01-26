const moment = require('moment');

function formatEvent(event) {
  var startDateTimeObj = moment(event.start.dateTime);
  var endDateTimeObj = moment(event.end.dateTime);
  return {
    event_name: event.summary,
    event_message: event.description,
    event_location: event.location,
    event_date: startDateTimeObj.format("dddd, DD MMM YYYY"),
    event_timing: {
      start_time: startDateTimeObj.format("h:mm a"),
      end_time: endDateTimeObj.format("h:mm a"),
    }
  }
}

function formatEventList(eventList) {
  console.log("Formatting Event List with " + eventList.length + " events");
  return new Promise(function(resolve, reject) {
    let formattedEventList = [];
    for (var i = 0; i < eventList.length; i++) {
      formattedEventList.push(formatEvent(eventList[i]));
    }
    resolve(formattedEventList);
  });
}

module.exports = {
  formatEvent,
  formatEventList,
}
