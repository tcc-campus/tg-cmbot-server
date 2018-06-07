/**
 * Formatter for event messages and inline keyboards
 */
const moment = require('moment');

function getMessageForUpcomingEventList(formattedEventList, requestedMonth) {
  console.log('Formatting upcoming message');
  let requestedMonthString = '';
  switch (requestedMonth) {
    case 'this_month':
      requestedMonthString = moment().format('MMMM YYYY');
      break;
    case 'next_month':
      requestedMonthString = moment()
        .add(1, 'month')
        .format('MMMM YYYY');
      break;
    default:
      break;
  }
  let upcomingMessage = '';

  if (formattedEventList.length > 0) {
    upcomingMessage = `Here are the list of Campus events happening in ${requestedMonthString}:\n\n`;

    for (let i = 0; i < formattedEventList.length; i += 1) {
      upcomingMessage += `${i + 1}. ${formattedEventList[i].event_name} - ${
        formattedEventList[i].event_date
      }\n`;
    }
    upcomingMessage +=
      '\nPlease select the corresponding numbers below to get more details on each event:';
  } else {
    upcomingMessage = `There are no upcoming events in ${requestedMonthString}!`;
  }
  return upcomingMessage;
}

function getMessageForUpcomingEventDetail(eventObj) {
  let eventDetailMessage = '';
  if (eventObj.event_message) {
    eventDetailMessage += `${eventObj.event_message}\n`;
  }
  eventDetailMessage += `*Details:*\nEvent Name: ${eventObj.event_name}\nDate: ${
    eventObj.event_date
  }\nTime: ${eventObj.event_timing.start_time} to ${eventObj.event_timing.end_time}\n`;
  if (eventObj.event_location) {
    eventDetailMessage += `Location: ${eventObj.event_location}\n`;
  }
  eventDetailMessage += '\nSee you there!';

  return eventDetailMessage;
}

function getInlineKeyboardForEventDetail(eventList) {
  const inlineKeyboardButtonList = [];
  const listSize = eventList.length;
  console.log(`Getting event detail inline keyboard object for event list size: ${listSize}`);
  let rowIndex = -1;
  for (let i = 0; i < listSize; i += 1) {
    if (i % 5 === 0) {
      inlineKeyboardButtonList.push([]);
      rowIndex += 1;
    }
    inlineKeyboardButtonList[rowIndex].push({
      text: i + 1,
      callback_data: `event/${eventList[i].id}`,
    });
  }
  return inlineKeyboardButtonList;
}

module.exports = {
  getMessageForUpcomingEventDetail,
  getMessageForUpcomingEventList,
  getInlineKeyboardForEventDetail,
};
