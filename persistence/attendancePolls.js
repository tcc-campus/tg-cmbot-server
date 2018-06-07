/**
 * DB Functions for Attendance Polls
 */
const { AttendancePoll } = require('../models/attendancePoll');

// const sequelize = require('sequelize');

const CREATE_ATTENDANCE_POLL_ACTION = 'action="createAttendancePoll"';

// const { Op } = sequelize;

async function createAttendancePoll(googleCalId, pollMessage, pollImageUrl) {
  try {
    const attendancePoll = await AttendancePoll.create({
      google_cal_id: googleCalId,
      poll_message: pollMessage,
      poll_image_url: pollImageUrl,
    });
    console.log(`${CREATE_ATTENDANCE_POLL_ACTION} attendancePoll=${JSON.stringify(attendancePoll)}`);
    return attendancePoll;
  } catch (err) {
    console.log(`${CREATE_ATTENDANCE_POLL_ACTION} error=${err}`);
    throw new Error();
  }
}

module.exports = {
  createAttendancePoll,
};
