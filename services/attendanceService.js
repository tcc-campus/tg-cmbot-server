/**
 * Service for Event Attendance
 */

const tgCaller = require('../apiCallers/telegramCaller');
const attendancePollPersistence = require('../persistence/attendancePolls');
const userPersistence = require('../persistence/users');
const attUtil = require('../utils/attendanceUtil');

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

async function broadcastAttendanceMessage(attendancePoll) {
  try {
    const attendancePollId = await saveAttendancePoll(attendancePoll);
    const options = {
      inline_keyboard: attUtil.getInlineKeyboardForAttendanceBroadcast(attendancePollId),
      image_url: attendancePoll.poll_image_url,
    };
    const subscriberIdList = await getListOfSubscriberIds();
    await tgCaller.sendMessageToList(subscriberIdList, attendancePoll.poll_message, options);
    console.log('Attendance Message successfully sent');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  broadcastAttendanceMessage,
  isAttendancePollValid,
};
