/**
 * DB Functions for Users
 */
const { Cell } = require('../models/cell');
const { User } = require('../models/user');

const sequelize = require('sequelize');

const { Op } = sequelize;

const GET_ALL_CELLS_ACTION = 'action="getAllCells"';
const GET_CELL_MEMBER_LIST_ACTION = 'action="getCellMemberList';

async function getAllCells() {
  try {
    const cellList = await Cell.findAll({
      attributes: ['id', 'cell_name', 'section_name'],
    });
    console.log(`${GET_ALL_CELLS_ACTION} cellList=${JSON.stringify(cellList)}`);
    return cellList;
  } catch (err) {
    console.log(`${GET_ALL_CELLS_ACTION} error=${err}`);
    throw new Error();
  }
}

async function getCellMemberList() {
  try {
    const cellList = await getAllCells();
    const queue = [];
    const cellMemberList = {};
    cellList.map((cell) => {
      queue.push(new Promise(async (resolve, reject) => {
        try {
          const memberList = await User.findAll({
            attributes: [['telegram_name', 'name']],
            where: {
              cell_id: {
                [Op.eq]: cell.id,
              },
            },
            raw: true,
          });
          cellMemberList[cell.cell_name] = memberList.map(member => member.name);
          resolve();
        } catch (err) {
          reject(err);
        }
      }));
      return null;
    });
    await Promise.all(queue);
    console.log(`${GET_CELL_MEMBER_LIST_ACTION} cellMemberList=${JSON.stringify(cellMemberList)}`);
    return cellMemberList;
  } catch (err) {
    console.log(`${GET_CELL_MEMBER_LIST_ACTION} error=${err}`);
    throw new Error();
  }
}

module.exports = {
  getAllCells,
  getCellMemberList,
};
