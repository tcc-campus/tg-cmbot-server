/* Modules to handle callback query events from Telegram
*   Exported Modules:
*     1. handleCallbackQueryEvent(callbackQueryObj): Handle Telegram Callback Query Event
*/

const dt_util = require('../utils/date_time_util');
const evt_formatter = require('../utils/event_formatter');
const msg_formatter = require('../utils/message_formatter');
const tg_caller = require('../api_callers/telegram_caller');
const pf_caller = require('../api_callers/platform_caller');

let cacheProvider = require('../cache_provider');

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log("Handling Telegram Callback Query Event");
  const messageId = callbackQueryObj.message.message_id;
  const chatId = callbackQueryObj.message.chat.id;
  const firstName = callbackQueryObj.message.chat.first_name;
  const callbackQueryData = callbackQueryObj.data;

  const callbackQueryType = getCallbackQueryType(messageId);
  if (callbackQueryType) {
    console.log("Callback query type detected: " + callbackQueryType);
    switch(callbackQueryType) {
      case 'upcoming_month_callback_query':
        handleUpcomingMonthCallbackQuery(chatId, callbackQueryData);
        break;
      default:
        console.log("Unknown callback query type");
        break;
      }
  } else {
    console.log("No callback query found from cache key");
  }
}

function handleUpcomingMonthCallbackQuery(chatId, callbackQueryData) {
  console.log("Handing upcoming choose month callback query");
  const requestedMonth = callbackQueryData
  const dateRange = dt_util.getDateRangeForMonth(requestedMonth);
  console.log("Date range selected: " + JSON.stringify(dateRange));
  pf_caller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
    console.log(result.message);
    const eventList = JSON.parse(result.body);
    console.log(eventList);
    evt_formatter.formatEventList(eventList).then(formattedEventList => {
      msg_formatter.formatUpcomingMessage(formattedEventList, requestedMonth).then((message) => {
        tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
          console.log(result.message);
        }).catch((error) => {
          console.log(error);
        });
      })
    })
  }).catch((error) => {
    console.log(error);
  })
}

function getCallbackQueryType(messageId) {
  console.log("Getting callback query type with cache key: " + messageId);
  return cacheProvider.instance().get(messageId);
}

module.exports = {
  handleCallbackQueryEvent,
}
