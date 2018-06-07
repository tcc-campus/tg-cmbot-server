/* Modules to format Campus events
*   Exported Modules:
*     1. formatEvent(event): For formatting a single campus event into JSON obj
*     2. formatEventList(eventList): For formatting a list of campus events into
*        an array of JSON obj
*/

const crypto = require('crypto-js');
const breakdance = require('breakdance');
const moment = require('moment-timezone');

function formatEvent(event) {
  const startDateTimeObj = moment.tz(event.start.dateTime, 'Asia/Singapore');
  const endDateTimeObj = moment.tz(event.end.dateTime, 'Asia/Singapore');
  let evtMsg = breakdance(event.description);
  evtMsg = evtMsg.replace(/\*\*/g, '*');
  evtMsg = evtMsg.replace(/<br><br>/g, '\n');
  evtMsg = evtMsg.replace(/<br>/g, '');
  return {
    id: crypto.HmacSHA1(event.id, 'SURGE').toString(),
    event_name: event.summary,
    event_message: evtMsg,
    event_location: event.location,
    event_date: startDateTimeObj.format('dddd, DD MMM YYYY'),
    event_date_raw: startDateTimeObj.format(),
    event_timing: {
      start_time: startDateTimeObj.format('h:mm a'),
      end_time: endDateTimeObj.format('h:mm a'),
    },
  };
}

function formatEventList(eventList) {
  console.log(`Formatting Event List with ${eventList.length} events`);
  const formattedEventList = [];
  for (let i = 0; i < eventList.length; i += 1) {
    if (eventList[i].id !== '_6913ehho8ork4b9h6or4cb9k6oq3gba16t244ba16d236g9o64rjid1i74') {
      formattedEventList.push(formatEvent(eventList[i]));
    }
  }
  return formattedEventList;
}

module.exports = {
  formatEvent,
  formatEventList,
};
