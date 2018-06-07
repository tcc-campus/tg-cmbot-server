/**
 * DB Functions for Users
 */
const { Cell } = require('../models/cell');

const GET_ALL_CELLS_ACTION = 'action="getAllCells"';

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

module.exports = {
  getAllCells,
};
