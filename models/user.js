const Sequelize = require('sequelize');

const config = require('../config');

const postgres = config.POSTGRES;

const { Attendance } = require('./attendance');
const { AttendancePoll } = require('./attendancePoll');
const { Cell } = require('./cell');

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

const User = sequelize.define(
  'users',
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    telegram_id: {
      type: Sequelize.BIGINT,
    },
    telegram_name: {
      type: Sequelize.CHAR,
    },
    cell_id: {
      type: Sequelize.INTEGER,
    },
    leadership: {
      type: Sequelize.CHAR,
    },
    is_subscribed: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: true,
    createdAt: 'creation_date',
    updatedAt: 'modified_date',
    freezeTableName: true,
    tableName: 'users',
  },
);

User.belongsTo(Cell, {
  foreignKey: 'cell_id',
  targetKey: 'id',
});

User.belongsToMany(AttendancePoll, {
  through: Attendance,
  foreignKey: 'user_id',
  otherKey: 'attendance_poll_id',
});

AttendancePoll.belongsToMany(User, {
  through: Attendance,
  foreignKey: 'attendance_poll_id',
  otherKey: 'user_id',
});

module.exports = {
  User,
};
