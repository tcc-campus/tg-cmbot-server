/* Modules to handle callback query events from Telegram
*   Exported Modules:
*     1. handleCallbackQueryEvent(callbackQueryObj): Handle Telegram Callback Query Event
*/

const dtUtil = require('../utils/dateTimeUtil');
const evtFormatter = require('../formatters/eventFormatter');
const subFormatter = require('../formatters/subscriptionFormatter');
const tgCaller = require('../apiCallers/telegramCaller');
const attService = require('../services/attendanceService');
const evtService = require('../services/eventService');
const subService = require('../services/subscriptionService');

const types = {
  ATTENDANCE: 'attendance',
  UPCOMING: 'upcoming',
  EVENT: 'event',
  SUBSCRIPTION: 'subscription',
  USER: 'user',
};

async function handleUpcomingMonthCallbackQuery(chatId, callbackQueryId, callbackQueryData) {
  console.log('Handing upcoming choose month callback query');
  const requestedMonth = callbackQueryData.shift();
  const dateString = dtUtil.getDateStringForMonth(requestedMonth);
  console.log(`Month selected: ${dateString}`);
  try {
    await Promise.all([
      tgCaller.sendChatAction(chatId, 'typing'),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId),
    ]);
    const eventList = await evtService.getByMonth(dateString);
    const message = evtFormatter.getMessageForUpcomingEventList(eventList, requestedMonth);
    const inlineKeyboardButtonList = evtFormatter.getInlineKeyboardForEventDetail(eventList);
    console.log(inlineKeyboardButtonList);
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
    await Promise.all([
      tgCaller.sendChatAction(chatId, 'typing'),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId),
    ]);
    const event = await evtService.getById(eventId);
    console.log(event);
    const message = evtFormatter.getMessageForUpcomingEventDetail(event);
    await tgCaller.sendMessage(chatId, message, { parse_mode: 'markdown' });
  } catch (error) {
    console.log('Error handling Upcoming Event Detail Callback Query:', error);
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
  }
}

async function handleSubscriptionCallbackQuery(
  chatId,
  messageId,
  callbackQueryId,
  callbackQueryData,
) {
  console.log('Handling subscription event callback query');
  const type = callbackQueryData.shift();
  switch (type) {
    case 'unsubscribe':
      await subService.updateUserSubscription(chatId, messageId, callbackQueryId, false);
      break;
    case 'subscribe':
      await subService.updateUserSubscription(chatId, messageId, callbackQueryId, true);
      break;
    case 'main_menu':
      try {
        await Promise.all([
          subService.goToSubscriptionMainMenu(chatId, messageId),
          tgCaller.sendAnswerCallbackQuery(callbackQueryId),
        ]);
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      await tgCaller.sendAnswerCallbackQuery(callbackQueryId);
      break;
  }
}

async function handleUserCallbackQuery(chatId, messageId, callbackQueryId, callbackQueryData) {
  let inlineKeyboard = [];
  try {
    const action = callbackQueryData.shift();
    if (action === 'edit') {
      const sectionName = callbackQueryData.shift();
      const cellId = callbackQueryData.shift();
      if (cellId) {
        await subService.updateUserCell(chatId, messageId, callbackQueryId, cellId);
      } else if (sectionName) {
        if (sectionName === 'uncelled') {
          const uncelledCellId = await subService.getCellId(sectionName);
          await subService.updateUserCell(chatId, messageId, callbackQueryId, uncelledCellId);
        } else {
          tgCaller.sendAnswerCallbackQuery(callbackQueryId);
          const sectionObj = await subService.getSectionObj(sectionName);
          inlineKeyboard = await subFormatter.getInlineKeyboardForCellSelection(
            sectionName,
            sectionObj,
          );
          tgCaller.editInlineKeyboardOnly(chatId, messageId, inlineKeyboard);
        }
      } else {
        let sectionList = [];
        [sectionList] = await Promise.all([
          subService.getSectionList(),
          tgCaller.sendAnswerCallbackQuery(callbackQueryId),
        ]);
        inlineKeyboard = subFormatter.getInlineKeyboardForSectionSelection(sectionList);
        tgCaller.editInlineKeyboardOnly(chatId, messageId, inlineKeyboard);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handleAttendanceCallbackQuery(chatId, messageId, callbackQueryId, callbackQueryData) {
  const type = callbackQueryData.shift();
  const attendancePollId = callbackQueryData.shift();
  switch (type) {
    case 'set':
      attService.updateAttendanceStatus(chatId, messageId, callbackQueryId, attendancePollId, true);
      break;
    case 'unset':
      attService.updateAttendanceStatus(
        chatId,
        messageId,
        callbackQueryId,
        attendancePollId,
        false,
      );
      break;
    case 'guests':
      attService.sendNumGuestKeyboard(chatId, messageId, callbackQueryId, attendancePollId);
      break;
    case 'main_menu':
      attService.sendAttendanceMainMenu(chatId, messageId, callbackQueryId, attendancePollId);
      break;
    case 'plus': {
      const numGuests = callbackQueryData.shift();
      attService.updateAttendanceNumGuests(
        chatId,
        messageId,
        callbackQueryId,
        attendancePollId,
        numGuests,
      );
      break;
    }
    default:
      break;
  }
}

function handleCallbackQueryEvent(callbackQueryObj) {
  console.log('Handling Telegram Callback Query Event');
  const messageId = callbackQueryObj.message.message_id;
  const chatId = callbackQueryObj.message.chat.id;
  const callbackQueryId = callbackQueryObj.id;
  // const firstName = callbackQueryObj.message.chat.first_name;
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
    case types.SUBSCRIPTION:
      handleSubscriptionCallbackQuery(chatId, messageId, callbackQueryId, callbackQueryData);
      break;
    case types.USER:
      handleUserCallbackQuery(chatId, messageId, callbackQueryId, callbackQueryData);
      break;
    case types.ATTENDANCE:
      handleAttendanceCallbackQuery(chatId, messageId, callbackQueryId, callbackQueryData);
      break;
    default:
      console.log('Unknown callback query type');
      tgCaller.sendAnswerCallbackQuery(callbackQueryId);
      break;
  }
}

module.exports = {
  handleCallbackQueryEvent,
};
