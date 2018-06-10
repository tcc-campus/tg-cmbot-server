/**
 * DB Functions for Attendance Polls
 */
const { AttendancePoll } = require('../models/attendancePoll');

const sequelize = require('sequelize');

const CREATE_ATTENDANCE_POLL_ACTION = 'action="createAttendancePoll"';
const GET_ALL_ATTENDANCE_POLL_ACTION = 'action="getAllAttendancePoll"';
const GET_ATTENDANCE_POLL_ACTION = 'action="getAttendancePoll"';

const { Op } = sequelize;

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

async function getAttendancePoll(attendancePollId) {
  try {
    const attendancePoll = await AttendancePoll.findOne({
      where: {
        id: {
          [Op.eq]: attendancePollId,
        },
      },
    });
    if (attendancePoll) {
      console.log(`${GET_ATTENDANCE_POLL_ACTION} attendancePoll=${JSON.stringify(attendancePoll)}`);
      return attendancePoll;
    }
    console.log(`${GET_ATTENDANCE_POLL_ACTION} No attendance poll found with that id ${attendancePollId}`);
    return null;
  } catch (err) {
    console.log(`${GET_ATTENDANCE_POLL_ACTION} error=${err}`);
    throw new Error();
  }
}

async function getAllAttendancePolls() {
  try {
    const attendancePollList = await AttendancePoll.findAll({ raw: true });
    console.log(`${GET_ALL_ATTENDANCE_POLL_ACTION} attendancePoll=${JSON.stringify(attendancePollList)}`);
    return attendancePollList;
  } catch (err) {
    console.log(`${GET_ALL_ATTENDANCE_POLL_ACTION} error=${err}`);
    throw new Error();
  }
}

module.exports = {
  createAttendancePoll,
  getAllAttendancePolls,
  getAttendancePoll,
};
