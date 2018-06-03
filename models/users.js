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
  },
});

const Users = sequelize.define('users', {
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
  }
}, {
  timestamps: true,
  createdAt: 'creation_date',
  updatedAt: 'modified_date',
  freezeTableName: true,
  tableName: 'users',
});

module.exports = {
  Users,
};
