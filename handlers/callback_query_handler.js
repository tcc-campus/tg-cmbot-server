/* Modules to handle callback query events from Telegram
*   Exported Modules:
*     1. handleCallbackQueryEvent(callbackQueryObj): Handle Telegram Callback Query Event
*/

const dt_util = require('../utils/date_time_util');
const c_util = require('../utils/cache_util');
const evt_formatter = require('../utils/event_formatter');
const msg_formatter = require('../utils/message_formatter');
const tg_caller = require('../api_callers/telegram_caller');
const pf_caller = require('../api_callers/platform_caller');

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log("Handling Telegram Callback Query Event");
  const messageId = callbackQueryObj.message.message_id;
  const chatId = callbackQueryObj.message.chat.id;
  const firstName = callbackQueryObj.message.chat.first_name;
  const callbackQueryData = callbackQueryObj.data;

  const cacheObj = c_util.getCacheObj(messageId)
  console.log("Cache Object: " + JSON.stringify(cacheObj));
  const callbackQueryType = cacheObj.type;
  const callbackQueryCacheData = cacheObj.data;
  if (callbackQueryType) {
    console.log("Callback query type detected: " + callbackQueryType);
    switch(callbackQueryType) {
      case c_util.CALLBACK_QUERY_TYPE.UPCOMING_MONTH:
        handleUpcomingMonthCallbackQuery(chatId, callbackQueryData);
        break;
      case c_util.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL:
        handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryData, callbackQueryCacheData);
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
  tg_caller.sendChatAction(chatId, 'typing').then((result) => {
    console.log(result);
    pf_caller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
      console.log(result.message);
      const eventList = JSON.parse(result.body);
      console.log(eventList);
      evt_formatter.formatEventList(eventList).then(formattedEventList => {
        msg_formatter.formatUpcomingMessage(formattedEventList, requestedMonth).then((message) => {
          getEventDetailInlineKeyboard(formattedEventList.length).then((inlineKeyboardButtonList) => {
            tg_caller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, c_util.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL, formattedEventList);
          })
        })
      })
    }).catch((error) => {
      console.log(error);
    })
  }).catch((error) => {
    console.log(error);
  })
}

function handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryData, callbackQueryCacheData) {
  console.log("Handling upcoming event detail callback query");
  const requestedEventIndex = callbackQueryData;
  const eventList = callbackQueryCacheData;
  const message = msg_formatter.formatEventDetail(eventList[requestedEventIndex]);
  tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  })
}

function getEventDetailInlineKeyboard(listSize) {
  const inlineKeyboardButtonList = [];
  console.log("Getting event detail inline keyboard object for event list size: " + listSize);
  return new Promise(function(resolve, reject) {
    let rowIndex = -1;
    for (var i=0; i<listSize; i++) {
      if (i%5 === 0) {
        inlineKeyboardButtonList.push([]);
        rowIndex += 1;
      }
      inlineKeyboardButtonList[rowIndex].push({
        text: i+1,
        callback_data: i,
      })
    }
    resolve(inlineKeyboardButtonList);
  });
}

module.exports = {
  handleCallbackQueryEvent,
}
