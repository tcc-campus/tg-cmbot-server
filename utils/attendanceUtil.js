/**
 * Util for Event Attendance
 */

function getInlineKeyboardForAttendanceBroadcast(attendancePollId) {
  return [
    [
      {
        text: "Yes, I'll be there!",
        callback_data: `attendance/set/${attendancePollId}`,
      },
    ],
    [
      {
        text: 'Invite Guests',
        callback_data: `attendance/guests/${attendancePollId}`,
      },
    ],
  ];
}

module.exports = {
  getInlineKeyboardForAttendanceBroadcast,
};
