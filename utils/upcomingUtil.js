const moment = require('moment');

/* Utility Modules for Upcoming Feature
*   Exported Modules:
*     1. getMessage(type, data): For formatting upcoming messages. 'data' is in
*        JSON format
*     2. getInlineKeyboard(type, data): For formatting inline keyboard for
*        upcoming messages. 'data' is in JSON format
*/

async function getMessage(type, data) {
  switch(type) {
    case 'main_menu':
      return `Which month of upcoming events do you want to view?`;
    case 'list_view':
      const msgForListView = await getMessageForListView(data.formatted_evt_list,
        data.requested_month);
      return msgForListView;
    default:
      return;
  }
}

async function getInlineKeyboard(type, data) {
  switch(type) {
    case 'main_menu':
      return getMainMenuInlineKeyboard();
    case 'list_view':
      const viewMenuInlineKeyboard = await getListViewInlineKeyboard(
        data.list_size, data.requested_month);
      return viewMenuInlineKeyboard;
    default:
      return;
  }
}

async function getMessageForListView(formattedEventList, requestedMonth){
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

  let upcomingMessage = "";

  if (formattedEventList.length > 0) {
    upcomingMessage = `Here are the list of Campus events happening in `
    + `${requestedMonthString}:\n\n`;

    for(var i = 0; i < formattedEventList.length; i++) {
      upcomingMessage = upcomingMessage + `${i+1}. `
      + `${formattedEventList[i].event_name} - `
      + `${formattedEventList[i].event_date}\n`;
    }
    upcomingMessage = upcomingMessage + "\nPlease select the corresponding "
    + "numbers below to get more details on each event:";

  } else {
    upcomingMessage = `There are no upcoming events in ${requestedMonthString}!`;
  }

  return upcomingMessage;
}

function getMainMenuInlineKeyboard() {
  return [[
    {
      text: 'This Month',
      callback_data: 'upcoming/this_month',
    },
    {
      text: 'Next Month',
      callback_data: 'upcoming/next_month',
    }
  ]]
}

function getListViewInlineKeyboard(listSize, requestedMonth) {
  const inlineKeyboardButtonList = [];
  console.log(`Getting event detail inline keyboard object for event list size:`
    + ` ${listSize}`);
  return new Promise(function(resolve, reject) {
    let rowIndex = -1;
    for (var i=0; i<listSize; i++) {
      if (i%5 === 0) {
        inlineKeyboardButtonList.push([]);
        rowIndex += 1;
      }
      inlineKeyboardButtonList[rowIndex].push({
        text: i+1,
        callback_data: `upcoming/${requestedMonth}/${i}`,
      })
    }
    inlineKeyboardButtonList.push([[{
      text: '<< Back to Month List', callback_data: 'upcoming'
    }]])
    resolve(inlineKeyboardButtonList);
  });
}

module.exports = {
  getMessage,
  getInlineKeyboard,
}
