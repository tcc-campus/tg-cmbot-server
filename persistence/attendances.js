/**
 * DB Functions for Attendance
 */
const { Attendance } = require('../models/attendance');

const sequelize = require('sequelize');

const CREATE_ATTENDANCE_ACTION = 'action="createAttendance"';
const GET_ATTENDANCE_ACTION = 'action="getAttendance"';
const UPDATE_ATTENDANCE_ACTION = 'action="updateAttendance"';

const { Op } = sequelize;

async function createAttendance(telegramId, attendancePollId, data) {
  try {
    const attendanceToCreate = Object.assign(
      { user_id: telegramId, attendance_poll_id: attendancePollId },
      data,
    );
    await Attendance.create(attendanceToCreate);
    console.log(`${CREATE_ATTENDANCE_ACTION} attendancePollId=${attendancePollId} telegramId=${telegramId}`);
  } catch (err) {
    console.log(`${CREATE_ATTENDANCE_ACTION} error=${err}`);
    throw new Error();
  }
}

async function getAttendance(telegramId, attendancePollId) {
  try {
    const attendance = await Attendance.findOne({
      where: {
        user_id: {
          [Op.eq]: telegramId,
        },
        attendance_poll_id: {
          [Op.eq]: attendancePollId,
        },
      },
      raw: true,
    });
    if (attendance) {
      console.log(`${GET_ATTENDANCE_ACTION} attendance=${JSON.stringify(attendance)}`);
      return attendance;
    }
    console.log(`${GET_ATTENDANCE_ACTION} No attendance found with that id ${telegramId}`);
    return null;
  } catch (err) {
    console.log(`${GET_ATTENDANCE_ACTION} error=${err}`);
    throw new Error();
  }
}

async function updateAttendance(telegramId, attendancePollId, dataToUpdate) {
  try {
    const result = await Attendance.update(dataToUpdate, {
      where: {
        user_id: {
          [Op.eq]: telegramId,
        },
        attendance_poll_id: {
          [Op.eq]: attendancePollId,
        },
      },
      returning: true,
    });

    if (result[0] > 0) {
      const updatedAttendance = await getAttendance(telegramId, attendancePollId);
      console.log(`${UPDATE_ATTENDANCE_ACTION} updatedUserTgId="${telegramId}"` +
          ` updatedAttendanceDetails="${JSON.stringify(updatedAttendance)}"`);
      return updatedAttendance;
    }
    console.log('No attendance found to update.');
    return null;
  } catch (err) {
    console.log(`${UPDATE_ATTENDANCE_ACTION} error="${err}"`);
    throw new Error();
  }
}

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
};
