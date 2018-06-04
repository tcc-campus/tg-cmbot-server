const Sequelize = require('sequelize');

const config = require('../config');

const postgres = config.POSTGRES;

const {
  Cells,
} = require('./cells');

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
  },
  cell_id: {
    type: Sequelize.INTEGER,
  },
  leadership: {
    type: Sequelize.CHAR,
  },
}, {
  timestamps: true,
  createdAt: 'creation_date',
  updatedAt: 'modified_date',
  freezeTableName: true,
  tableName: 'users',
});

Users.belongsTo(Cells, {
  foreignKey: 'cell_id',
  targetKey: 'id',
});

module.exports = {
  Users,
};
