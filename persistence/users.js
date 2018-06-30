/**
 * DB Functions for Users
 */
const { User } = require('../models/user');

const { Cell } = require('../models/cell');

const sequelize = require('sequelize');

const CREATE_USER_ACTION = 'action="createUser"';
const GET_SUBSCRIBER_LIST_ACTION = 'action="getSubscriberList"';
const GET_USER_ACTION = 'action="getUser"';
const GET_USER_MODEL_ACTION = 'action="getUserModel"';
const UPDATE_USER_ACTION = 'action="updateUser"';

const { Op } = sequelize;

async function createUser(telegramId, telegramName) {
  try {
    const user = await User.create({ telegram_id: telegramId, telegram_name: telegramName });
    console.log(`${CREATE_USER_ACTION} user=${JSON.stringify(user)}`);
  } catch (err) {
    console.log(`${CREATE_USER_ACTION} error=${err}`);
    throw new Error();
  }
}

async function getUser(telegramId) {
  try {
    const user = await User.findOne({
      where: {
        telegram_id: {
          [Op.eq]: telegramId,
        },
      },
      include: [
        {
          model: Cell,
          attributes: ['cell_name', 'section_name'],
        },
      ],
      raw: true,
    });
    if (user) {
      console.log(`${GET_USER_ACTION} user=${JSON.stringify(user)}`);
      user.cell = {
        cell_name: user['cell.cell_name'],
        section_name: user['cell.section_name'],
      };
      return user;
    }
    console.log(`${GET_USER_ACTION} No user found with that id ${telegramId}`);
    return null;
  } catch (err) {
    console.log(`${GET_USER_ACTION} error=${err}`);
    throw new Error();
  }
}

async function getUserModel(telegramId) {
  try {
    const user = await User.findOne({
      where: {
        telegram_id: {
          [Op.eq]: telegramId,
        },
      },
    });
    if (user) {
      console.log(`${GET_USER_MODEL_ACTION} user=${JSON.stringify(user)}`);
      return user;
    }
    console.log(`${GET_USER_MODEL_ACTION} No user found with that id ${telegramId}`);
    return null;
  } catch (err) {
    console.log(`${GET_USER_MODEL_ACTION} error=${err}`);
    throw new Error();
  }
}

async function updateUser(telegramId, updatedUser) {
  try {
    const result = await User.update(updatedUser, {
      where: {
        telegram_id: {
          [Op.eq]: telegramId,
        },
      },
      returning: true,
    });

    if (result[0] > 0) {
      console.log(`${UPDATE_USER_ACTION} updatedUserTgId="${telegramId}"` +
          ` updatedUserDetails="${JSON.stringify(updatedUser)}"`);
    } else {
      throw new Error('No user found to update');
    }
  } catch (err) {
    console.log(`${UPDATE_USER_ACTION} error="${err}"`);
    throw new Error();
  }
}

async function getListOfSubscribers() {
  try {
    const subscriberList = await User.findAll({
      attributes: ['telegram_id'],
      where: {
        is_subscribed: {
          [Op.eq]: true,
        },
      },
    });
    if (subscriberList.length > 0) {
      console.log(`${GET_SUBSCRIBER_LIST_ACTION} user=${JSON.stringify(subscriberList)}`);
      return subscriberList;
    }
    throw new Error('No subscribers found');
  } catch (err) {
    console.log(`${GET_SUBSCRIBER_LIST_ACTION} error="${err}"`);
    throw new Error();
  }
}

module.exports = {
  createUser,
  getListOfSubscribers,
  getUser,
  getUserModel,
  updateUser,
};
