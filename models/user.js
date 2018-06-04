const Sequelize = require('sequelize');

const config = require('../config');

const postgres = config.POSTGRES;

const {
  Cell,
} = require('./cell');

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

const User = sequelize.define('users', {
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
}, {
  timestamps: true,
  createdAt: 'creation_date',
  updatedAt: 'modified_date',
  freezeTableName: true,
  tableName: 'users',
});

User.belongsTo(Cell, {
  foreignKey: 'cell_id',
  targetKey: 'id',
});

module.exports = {
  User,
};
