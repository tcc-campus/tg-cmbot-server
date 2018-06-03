/**
 * Util for Event Attendance
 */

 function getInlineKeyboardForAttendanceBroadcast(eventId) {
   return [[{
     text: "Yes, I'll be there!",
     callback_data: `attendance/set/${eventId}`,
   }]]
 }

 module.exports = {
   getInlineKeyboardForAttendanceBroadcast,
 }
