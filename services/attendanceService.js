/**
 * Service for Event Attendance
 */

const tgCaller = require('../apiCallers/telegramCaller');
const attUtil = require('../utils/attendanceUtil');

/**
 * Checks if Attendance Object is Valid
 *
 * @param  {{event_id: string, event_message: string, event_image_url: string}} attendanceObj
 *
 * @return {boolean}
 */
function isAttendanceObjValid(attendanceObj) {
  if (!attendanceObj.event_id) {
    throw new Error('event_id not found');
  } else if (!attendanceObj.event_message) {
    throw new Error('event_message not found');
  } else {
    return true;
  }
  return false;
}

async function broadcastAttendanceMessage(attendanceObj) {
  // TODO: Get list of subscribers
  try {
    const options = {
      inline_keyboard: attUtil.getInlineKeyboardForAttendanceBroadcast(attendanceObj.event_id),
      image_url: attendanceObj.event_image_url, 
    };
    await tgCaller.sendMessageToList(['64094547'], attendanceObj.event_message, options);
    console.log('Attendance Message successfully sent');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  broadcastAttendanceMessage,
  isAttendanceObjValid,
};
