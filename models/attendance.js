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

const Attendance = sequelize.define(
  'attendances',
  {
    user_id: {
      type: Sequelize.INTEGER,
    },
    attendance_poll_id: {
      type: Sequelize.INTEGER,
    },
    is_attending: {
      type: Sequelize.BOOLEAN,
    },
    num_guests: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: true,
    createdAt: 'creation_date',
    updatedAt: 'modified_date',
    freezeTableName: true,
    tableName: 'attendances',
  },
);

module.exports = {
  Attendance,
};
