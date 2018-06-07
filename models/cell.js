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

const Cell = sequelize.define('cells', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
  },
  cell_name: {
    type: Sequelize.CHAR,
  },
  section_name: {
    type: Sequelize.CHAR,
  },
}, {
  timestamps: true,
  createdAt: 'creation_date',
  updatedAt: 'modified_date',
  freezeTableName: true,
  tableName: 'cells',
});

module.exports = {
  Cell,
};
