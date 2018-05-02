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
  const callbackQueryId = callbackQueryObj.callback_query.id;
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
          handleUpcomingMonthCallbackQuery(chatId, callbackQueryId, callbackQueryData);
          break;
        case cUtil.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL:
          handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryId, callbackQueryData, callbackQueryCacheData);
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

async function handleUpcomingMonthCallbackQuery(chatId, callbackQueryId, callbackQueryData) {
  console.log("Handing upcoming choose month callback query");
  const requestedMonth = callbackQueryData;
  const dateRange = dtUtil.getDateRangeForMonth(requestedMonth);
  console.log("Date range selected: " + JSON.stringify(dateRange));
  try {
    await tgCaller.sendChatAction(chatId, 'typing');
    const upcomingEvents = await pfCaller.getUpcomingEvents(dateRange.start_date, dateRange.end_date);
    const eventList = JSON.parses(upcomingEvents.body);
    console.log(eventList);
    const formattedEventList = await evtFormatter.formatEventList(eventList);
    const message = await msgFormatter.formatUpcomingMessage(formattedEventList, requestedMonth);
    const inlineKeyboardButtonList = await getEventDetailInlineKeyboard(formattedEventList.length);
    await tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, cUtil.CALLBACK_QUERY_TYPE.UPCOMING_EVENT_DETAIL, formattedEventList);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  } catch(error) {
    console.log("Error handling Upcoming Month Callback Query:", error);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  }
}

async function handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryId, callbackQueryData, callbackQueryCacheData) {
  console.log("Handling upcoming event detail callback query");
  const requestedEventIndex = callbackQueryData;
  const eventList = callbackQueryCacheData;
  const message = msgFormatter.formatEventDetail(eventList[requestedEventIndex]);
  try {
    await tgCaller.sendChatAction(chatId, 'typing');
    await tgCaller.sendMessage(chatId, message, {'parse_mode': 'markdown'});
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  } catch(error) {
    console.log("Error handling Upcoming Event Detail Callback Query:", error);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  }
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
