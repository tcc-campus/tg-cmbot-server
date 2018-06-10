/**
 * Formatter for event messages and inline keyboards
 */
const crypto = require('crypto-js');
const breakdance = require('breakdance');
const moment = require('moment-timezone');

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

function formatEvent(event) {
  const startDateTimeObj = moment.tz(event.start.dateTime, 'Asia/Singapore');
  const endDateTimeObj = moment.tz(event.end.dateTime, 'Asia/Singapore');
  let evtMsg = breakdance(event.description);
  evtMsg = evtMsg.replace(/\*\*/g, '*');
  evtMsg = evtMsg.replace(/<br><br>/g, '\n');
  evtMsg = evtMsg.replace(/<br>/g, '');
  return {
    id: crypto.HmacSHA1(event.id, 'SURGE').toString(),
    google_cal_id: event.id,
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
  getMessageForUpcomingEventDetail,
  getMessageForUpcomingEventList,
  getInlineKeyboardForEventDetail,
};
