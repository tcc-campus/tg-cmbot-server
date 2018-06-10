/**
 * Formatter for attendance messages and inline keyboards
 */

function getMessageForAttendancePoll(attendancePollMessage, isAttending, numGuests) {
  let message = `${attendancePollMessage}\n\n`;
  message += `Attendance: ${
    isAttending ? "I'll be there!" : 'CMI 😔'
  }\nNo. of Guests: ${numGuests}`;
  return message;
}

function getInlineKeyboardForAttendancePoll(attendancePollId, isAttending) {
  const inlineKeyboard = [[]];
  if (isAttending) {
    inlineKeyboard[0].push({
      text: 'CMI 😔',
      callback_data: `attendance/unset/${attendancePollId}`,
    });
  } else {
    inlineKeyboard[0].push({
      text: "Yes, I'll be there!",
      callback_data: `attendance/set/${attendancePollId}`,
    });
  }
  inlineKeyboard[0].push({
    text: 'Invite Guests',
    callback_data: `attendance/guests/${attendancePollId}`,
  });
  return inlineKeyboard;
}

function getInlineKeyboardForNumGuests(attendancePollId) {
  const inlineKeyboard = [];
  let rowIndex = -1;
  for (let i = 0; i < 11; i += 1) {
    if (i % 4 === 0) {
      inlineKeyboard.push([]);
      rowIndex += 1;
    }
    inlineKeyboard[rowIndex].push({
      text: `+ ${i}`,
      callback_data: `attendance/plus/${attendancePollId}/${i}`,
    });
  }
  inlineKeyboard[rowIndex].push({
    text: '<< Back',
    callback_data: 'attendance/main_menu',
  });
  return inlineKeyboard;
}

module.exports = {
  getMessageForAttendancePoll,
  getInlineKeyboardForAttendancePoll,
  getInlineKeyboardForNumGuests,
};
