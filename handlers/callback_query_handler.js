const dt_util = require('../utils/date_time_util');
const evt_formatter = require('../utils/event_formatter');
const msg_formatter = require('../utils/message_formatter');

let cacheProvider = require('../cache_provider');

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log("Handling Telegram Callback Query Event");
  const messageId = callbackQueryObj.message.id;
  const chatId = callbackQueryObj.chat.id;
  const firstName = callbackQueryObj.chat.first_name;
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
  const dateRange = dt_util.getDateRangeForMonth(callbackQueryData);
  console.log("Date range for this month: " + JSON.stringify(dateRange));
  pf_caller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
    console.log(result.message);
    const eventList = JSON.parse(result.body);
    console.log(eventList);
    evt_formatter.formatEventList(eventList).then(formattedEventList => {
      msg_formatter.formatUpcomingMessage(formattedEventList).then((message) => {
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
