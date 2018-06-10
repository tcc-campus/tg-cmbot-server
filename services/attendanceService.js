/**
 * Service for Event Attendance
 */

const async = require('async');

const tgCaller = require('../apiCallers/telegramCaller');
const attendancePersistence = require('../persistence/attendances');
const attendancePollPersistence = require('../persistence/attendancePolls');
const userPersistence = require('../persistence/users');
const cService = require('../cache/cacheService');
const attFormatter = require('../formatters/attendanceFormatter');

const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

/**
 * Checks if Attendance Poll is Valid
 *
 * @param  {{event_id: string, google_cal_id: poll_message, poll_image_url: string}} attendancePoll
 *
 * @return {boolean}
 */
function isAttendancePollValid(attendancePoll) {
  if (!attendancePoll.google_cal_id) {
    throw new Error('google_cal_id not found');
  } else if (!attendancePoll.poll_message) {
    throw new Error('poll_message not found');
  } else {
    return true;
  }
}

async function getListOfSubscriberIds() {
  const subscriberList = await userPersistence.getListOfSubscribers();
  const subscriberIdList = [];
  subscriberList.forEach((subscriber) => {
    subscriberIdList.push(subscriber.telegram_id);
  });
  return subscriberIdList;
}

async function saveAttendancePoll(attendancePoll) {
  const createdAttendancePoll = await attendancePollPersistence.createAttendancePoll(
    attendancePoll.google_cal_id,
    attendancePoll.poll_message,
    attendancePoll.poll_image_url,
  );
  return createdAttendancePoll.id;
}

async function cacheAttendancePoll(attendancePollId, attendancePoll) {
  await cService.set(cService.cacheTables.ATTENDANCE, attendancePollId, attendancePoll, CACHE_TTL);
}

async function getCacheAttendancePoll(attendancePollId) {
  const attendancePoll = await cService.get(cService.cacheTables.ATTENDANCE, attendancePollId);
  return attendancePoll;
}

async function cacheAttendancePollList() {
  const attendancePollList = await attendancePollPersistence.getAllAttendancePolls();
  const waitQueue = () =>
    new Promise((resolve) => {
      const q = async.queue(async (attendancePoll, callback) => {
        await cacheAttendancePoll(attendancePoll.id, attendancePoll);
        callback();
      }, 15);

      q.push(attendancePollList);

      q.drain = () => {
        console.log('Attendance Poll cache updated');
        resolve();
      };
    });

  await waitQueue();
}

async function broadcastAttendanceMessage(attendancePoll) {
  try {
    const attendancePollId = await saveAttendancePoll(attendancePoll);
    const options = {
      inline_keyboard: attFormatter.getInlineKeyboardForAttendancePoll(attendancePollId, false),
      image_url: attendancePoll.poll_image_url,
    };
    let subscriberIdList = [];
    [subscriberIdList] = await Promise.all([
      getListOfSubscriberIds(),
      cacheAttendancePoll(attendancePollId, attendancePoll),
    ]);
    subscriberIdList = ['64094547', '36845946', '217009906', '141464841'];
    await Promise.all([
      tgCaller.sendMessageToList(subscriberIdList, attendancePoll.poll_message, options),
      cacheAttendancePoll(attendancePollId, attendancePoll),
    ]);
    console.log('Attendance Message successfully sent');
  } catch (error) {
    console.log(error);
  }
}

async function updateAttendanceStatus(
  chatId,
  messageId,
  callbackQueryId,
  attendancePollId,
  isAttending,
) {
  try {
    const updatedAttendance = await attendancePersistence.updateAttendance(
      chatId,
      attendancePollId,
      { is_attending: isAttending },
    );
    if (!updatedAttendance) {
      await attendancePersistence.createAttendance(chatId, attendancePollId, {
        is_attending: isAttending,
      });
    }
    let attendancePoll = {};
    [attendancePoll] = await Promise.all([
      getCacheAttendancePoll(attendancePollId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId, 'Attendance successfully updated!'),
    ]);
    const numGuests = updatedAttendance ? updatedAttendance.num_guests : 0;
    const message = attFormatter.getMessageForAttendancePoll(
      attendancePoll.poll_message,
      isAttending,
      numGuests,
    );
    const inlineKeyboard = attFormatter.getInlineKeyboardForAttendancePoll(
      attendancePollId,
      isAttending,
    );
    await tgCaller.editMessageWithInlineKeyboard(chatId, messageId, message, inlineKeyboard);
  } catch (error) {
    console.log(`Error in updating attendance status: ${error}`);
    await tgCaller.sendAnswerCallbackQuery(
      callbackQueryId,
      'Error: Attendance not updated successfully!',
    );
  }
}

async function updateAttendanceNumGuests(
  chatId,
  messageId,
  callbackQueryId,
  attendancePollId,
  numGuests,
) {
  try {
    const updatedAttendance = await attendancePersistence.updateAttendance(
      chatId,
      attendancePollId,
      { num_guests: numGuests },
    );
    if (!updatedAttendance) {
      await attendancePersistence.createAttendance(chatId, attendancePollId, {
        num_guests: numGuests,
      });
    }
    let attendancePoll = {};
    [attendancePoll] = await Promise.all([
      getCacheAttendancePoll(attendancePollId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId, 'Attendance successfully updated!'),
    ]);
    const isAttending = updatedAttendance ? updatedAttendance.is_attending : false;
    const message = attFormatter.getMessageForAttendancePoll(
      attendancePoll.poll_message,
      isAttending,
      numGuests,
    );
    const inlineKeyboard = attFormatter.getInlineKeyboardForAttendancePoll(
      attendancePollId,
      isAttending,
    );
    await tgCaller.editMessageWithInlineKeyboard(chatId, messageId, message, inlineKeyboard);
  } catch (error) {
    console.log(`Error in updating attendance status: ${error}`);
    await tgCaller.sendAnswerCallbackQuery(
      callbackQueryId,
      'Error: Attendance not updated successfully!',
    );
  }
}

async function sendNumGuestKeyboard(chatId, messageId, callbackQueryId, attendancePollId) {
  try {
    const inlineKeyboard = attFormatter.getInlineKeyboardForNumGuests(attendancePollId);
    await Promise.all([
      tgCaller.sendAnswerCallbackQuery(callbackQueryId),
      tgCaller.editInlineKeyboardOnly(chatId, messageId, inlineKeyboard),
    ]);
  } catch (error) {
    tgCaller.sendAnswerCallbackQuery(callbackQueryId);
    console.log(error);
  }
}

async function sendAttendanceMainMenu(chatId, messageId, callbackQueryId, attendancePollId) {
  try {
    let attendance = {};
    [attendance] = await Promise.all([
      attendancePersistence.getAttendance(chatId, attendancePollId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId),
    ]);
    const inlineKeyboard = attFormatter.getInlineKeyboardForAttendancePoll(
      attendancePollId,
      attendance.is_attending,
    );
    await tgCaller.editInlineKeyboardOnly(chatId, messageId, inlineKeyboard);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  cacheAttendancePollList,
  broadcastAttendanceMessage,
  isAttendancePollValid,
  sendAttendanceMainMenu,
  sendNumGuestKeyboard,
  updateAttendanceNumGuests,
  updateAttendanceStatus,
};
