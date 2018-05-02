/* Modules to handle callback query events from Telegram
*   Exported Modules:
*     1. handleCallbackQueryEvent(callbackQueryObj): Handle Telegram Callback Query Event
*/

const dtUtil = require('../utils/dateTimeUtil');
const cUtil = require('../utils/cacheUtil');
const evtFormatter = require('../utils/eventFormatter');
const msgFormatter = require('../utils/messageFormatter');
const tgCaller = require('../apiCallers/telegramCaller');
const pfCaller = require('../apiCallers/platformCaller');

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log("Handling Telegram Callback Query Event");
  const messageId = callbackQueryObj.message.message_id;
  const chatId = callbackQueryObj.message.chat.id;
  const firstName = callbackQueryObj.message.chat.first_name;
  const callbackQueryData = callbackQueryObj.data;

  const cacheObj = cUtil.getCacheObj(messageId)
  if (cacheObj) {
    console.log("Cache Object: " + JSON.stringify(cacheObj));
    const callbackQueryType = cacheObj.type;
    const callbackQueryCacheData = cacheObj.data;
    if (callbackQueryType) {
      console.log("Callback query type detected: " + callbackQueryType);
      switch(callbackQueryType) {
        case cUtil.CALLBACK_QUERY_TYPE.UPCOMING_MONTH:
          handleUpcomingMonthCallbackQuery(chatId, callbackQueryData);
          break;
        case cUtil.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL:
          handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryData, callbackQueryCacheData);
          break;
        default:
          console.log("Unknown callback query type");
          break;
        }
    } else {
      console.log("No callback query found from cache key");
    }
  } else {
    console.log("No cache key-value found from cache key");
  }

}

function handleUpcomingMonthCallbackQuery(chatId, callbackQueryData) {
  console.log("Handing upcoming choose month callback query");
  const requestedMonth = callbackQueryData
  const dateRange = dtUtil.getDateRangeForMonth(requestedMonth);
  console.log("Date range selected: " + JSON.stringify(dateRange));
  tgCaller.sendChatAction(chatId, 'typing').then((result) => {
    console.log(result);
    pfCaller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
      console.log(result.message);
      const eventList = JSON.parse(result.body);
      console.log(eventList);
      evtFormatter.formatEventList(eventList).then(formattedEventList => {
        msgFormatter.formatUpcomingMessage(formattedEventList, requestedMonth).then((message) => {
          getEventDetailInlineKeyboard(formattedEventList.length).then((inlineKeyboardButtonList) => {
            tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, cUtil.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL, formattedEventList);
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
  const message = msgFormatter.formatEventDetail(eventList[requestedEventIndex]);
  tgCaller.sendChatAction(chatId, 'typing').then((result) => {
    console.log(result);
    tgCaller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    })
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
