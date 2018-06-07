/**
 * Util for Event Attendance
 */

function getInlineKeyboardForAttendanceBroadcast(eventId) {
  return [[{
    text: "Yes, I'll be there!",
    callback_data: `attendance/set/${eventId}`,
  },],[ {
    text: 'Share',
    switch_inline_query: 'Share Event',
  }]];
}

module.exports = {
  getInlineKeyboardForAttendanceBroadcast,
};
