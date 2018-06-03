/* Modules to handle callback query events from Telegram
*   Exported Modules:
*     1. handleCallbackQueryEvent(callbackQueryObj): Handle Telegram Callback Query Event
*/

const dtUtil = require('../utils/dateTimeUtil');
const cUtil = require('../utils/cacheUtil');
const evtFormatter = require('../utils/eventFormatter');
const msgFormatter = require('../utils/messageFormatter');
const tgCaller = require('../apiCallers/telegramCaller');
const evtService = require('../services/eventService');

const types = {
  UPCOMING: 'upcoming',
  EVENT: 'event',
};

async function handleUpcomingMonthCallbackQuery(chatId, callbackQueryId, callbackQueryData) {
  console.log('Handing upcoming choose month callback query');
  const requestedMonth = callbackQueryData.shift();
  const dateString = dtUtil.getDateStringForMonth(requestedMonth);
  console.log(`Month selected: ${dateString}`);
  try {
    await Promise.all([tgCaller.sendChatAction(chatId, 'typing'), tgCaller.sendAnswerCallbackQuery(callbackQueryId)]);
    const eventList = await evtService.getByMonth(dateString);
    const message = await msgFormatter.formatUpcomingMessage(eventList, requestedMonth);
    const inlineKeyboardButtonList = getEventDetailInlineKeyboard(eventList);
    console.log(inlineKeyboardButtonList)
    await tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList);
  } catch (error) {
    console.log('Error handling Upcoming Month Callback Query:', error);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  }
}

async function handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryId, callbackQueryData) {
  console.log('Handling upcoming event detail callback query');
  const eventId = callbackQueryData.shift();
  try {
    await Promise.all([tgCaller.sendChatAction(chatId, 'typing'), tgCaller.sendAnswerCallbackQuery(callbackQueryId)]);
    const event = await evtService.getById(eventId);
    console.log(event);
    const message = msgFormatter.formatEventDetail(event);
    await tgCaller.sendMessage(chatId, message, { parse_mode: 'markdown' });
  } catch (error) {
    console.log('Error handling Upcoming Event Detail Callback Query:', error);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  }
}

function getEventDetailInlineKeyboard(eventList) {
  const inlineKeyboardButtonList = [];
  const listSize = eventList.length;
  console.log(`Getting event detail inline keyboard object for event list size: ${listSize}`);
  let rowIndex = -1;
  for (let i = 0; i < listSize; i++) {
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

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log('Handling Telegram Callback Query Event');
  const messageId = callbackQueryObj.message.message_id;
  const chatId = callbackQueryObj.message.chat.id;
  const callbackQueryId = callbackQueryObj.id;
  const firstName = callbackQueryObj.message.chat.first_name;
  const callbackQueryData = callbackQueryObj.data.split('/');
  const callbackQueryType = callbackQueryData.shift();

  console.log(`Callback query type detected: ${callbackQueryType}`);
  switch (callbackQueryType) {
    case types.UPCOMING:
      handleUpcomingMonthCallbackQuery(chatId, callbackQueryId, callbackQueryData);
      break;
    case types.EVENT:
      handleUpcomingEventDetailCallbackQuery(chatId, callbackQueryId, callbackQueryData);
      break;
    default:
      console.log('Unknown callback query type');
      break;
  }
}

module.exports = {
  handleCallbackQueryEvent,
};
