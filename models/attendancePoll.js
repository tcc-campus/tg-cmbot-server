const Sequelize = require('sequelize');

const config = require('../config');

const postgres = config.POSTGRES;

const sequelize = new Sequelize(postgres.database, postgres.username, postgres.password, {
  port: postgres.port,
  host: postgres.host,
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    application_name: postgres.applicationName,
    ssl: true,
  },
});

const AttendancePoll = sequelize.define(
  'attendancePolls',
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    google_cal_id: {
      type: Sequelize.CHAR,
    },
    poll_message: {
      type: Sequelize.CHAR,
    },
    poll_image_url: {
      type: Sequelize.CHAR,
    },
  },
  {
    timestamps: true,
    createdAt: 'creation_date',
    updatedAt: 'modified_date',
    freezeTableName: true,
    tableName: 'attendance_polls',
  },
);

module.exports = {
  AttendancePoll,
};
