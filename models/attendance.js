const Sequelize = require('sequelize');

const config = require('../config');

const postgres = config.POSTGRES;

const {
  AttendancePoll,
} = require('./attendancePoll');

const {
  User,
} = require('./user');

const sequelize = new Sequelize(postgres.database, postgres.username, postgres.password, {
  port: postgres.port,
  host: postgres.host,
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    application_name: postgres.applicationName,
  },
});

const Attendance = sequelize.define('attendances', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  attendance_poll_id: {
    type: Sequelize.INTEGER,
  },
  is_attending: {
    type: Sequelize.BOOLEAN,
  },
}, {
  timestamps: true,
  createdAt: 'creation_date',
  updatedAt: 'modified_date',
  freezeTableName: true,
  tableName: 'attendances',
});


Attendance.belongsTo(AttendancePoll, {
  foreignKey: 'attendance_poll_id',
  targetKey: 'id',
});

Attendance.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
});

module.exports = {
  Attendance,
};
