/* Modules to format Campus events
*   Exported Modules:
*     1. formatEvent(event): For formatting a single campus event into JSON obj
*     2. formatEventList(eventList): For formatting a list of campus events into
*        an array of JSON obj
*/

const moment = require('moment-timezone');

function formatEvent(event) {
  var startDateTimeObj = moment.tz(event.start.dateTime, "Asia/Singapore");
  var endDateTimeObj = moment.tz(event.end.dateTime, "Asia/Singapore");
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
