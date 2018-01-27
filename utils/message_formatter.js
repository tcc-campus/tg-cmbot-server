/* Modules to format messages
*   Exported Modules:
*     1. formatUpcomingMessage(formattedEventList, requestedMonth): For formatting
*        messages for the /upcoming command
*     2. formatEventDetail(eventObj): For formatting message for event detail
*/

moment = require('moment');

function formatUpcomingMessage(formattedEventList, requestedMonth) {
  console.log("Formatting upcoming message");
  let requestedMonthString = "";
  switch (requestedMonth) {
    case 'this_month':
      requestedMonthString = moment().format('MMMM YYYY');
      break;
    case 'next_month':
      requestedMonthString = moment().add(1, 'month').format('MMMM YYYY');
      break;
    default:
      break;
  }
  return new Promise(function(resolve, reject) {
    let upcomingMessage = "";

    if (formattedEventList.length > 0) {
      upcomingMessage = `Here are the list of Campus events happening in ${requestedMonthString}:\n\n`;

      for(var i = 0; i < formattedEventList.length; i++) {
        upcomingMessage = upcomingMessage + `${i+1}. ${formattedEventList[i].event_name} - ${formattedEventList[i].event_date}\n`
      }
      upcomingMessage = upcomingMessage + "\nPlease select the corresponding numbers below to get more details on each event:"

    } else {
      upcomingMessage = `There are no upcoming events in ${requestedMonthString}!`;
    }
    resolve(upcomingMessage);
  });
}

function formatEventDetail(eventObj) {
  let eventDetailMessage = "";
  if (eventObj.event_message) {
    eventDetailMessage += eventObj.event_message + "\n\n";
  }
  eventDetailMessage += `**Details:**\nEvent Name: ${eventObj.event_name}\nDate: ${eventObj.event_date}\nTime: ${eventObj.event_timing.start_time} to ${eventObj.event_timing.end_time}\n\n`;
  eventDetailMessage += "See you there!";

  return eventDetailMessage;
}

module.exports = {
  formatUpcomingMessage,
  formatEventDetail,
}
