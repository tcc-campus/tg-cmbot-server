/**
 * Service modules for User Subscription
 */

const tgCaller = require('../apiCallers/telegramCaller');
const subFormatter = require('../formatters/subscriptionFormatter');
const cellPersistence = require('../persistence/cells');
const userPersistence = require('../persistence/users');
const cService = require('../cache/cacheService');

const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

async function sendSubscriptionDetails(chatId, firstName) {
  try {
    let user = {};
    [user] = await Promise.all([
      userPersistence.getUser(chatId),
      tgCaller.sendChatAction(chatId, 'typing'),
    ]);
    const message = subFormatter.getMessageForSubscriptionDetails(firstName, user);
    const inlineKeyboard = subFormatter.getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboard);
  } catch (error) {
    console.log(error);
  }
}

async function goToSubscriptionMainMenu(chatId, messageId) {
  try {
    let user = {};
    [user] = await Promise.all([
      userPersistence.getUser(chatId),
      tgCaller.sendChatAction(chatId, 'typing'),
    ]);
    const inlineKeyboard = subFormatter.getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.editInlineKeyboardOnly(chatId, messageId, inlineKeyboard);
  } catch (error) {
    console.log(error);
  }
}

async function updateUserSubscription(chatId, messageId, callbackQueryId, isSubscribed) {
  const subscribeText = isSubscribed ? 'Subscription' : 'Unsubscribed';
  try {
    let user = {};
    await userPersistence.updateUser(chatId, { is_subscribed: isSubscribed });
    [user] = await Promise.all([
      userPersistence.getUser(chatId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId, { text: `${subscribeText} Successfully!` }),
    ]);
    const message = subFormatter.getMessageForSubscriptionDetails(user.telegram_name, user);
    const inlineKeyboard = subFormatter.getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.editMessageWithInlineKeyboard(chatId, messageId, message, inlineKeyboard);
  } catch (error) {
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId, {
      text: `${subscribeText} Unsuccessful. Please try again`,
    });
  }
}

async function updateUserCell(chatId, messageId, callbackQueryId, cellId) {
  try {
    let user = {};
    await userPersistence.updateUser(chatId, { cell_id: cellId });
    [user] = await Promise.all([
      userPersistence.getUser(chatId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId, { text: 'Cell Updated Successfully!' }),
    ]);
    const message = subFormatter.getMessageForSubscriptionDetails(user.telegram_name, user);
    const inlineKeyboard = subFormatter.getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.editMessageWithInlineKeyboard(chatId, messageId, message, inlineKeyboard);
  } catch (error) {
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId, {
      text: 'Updating Cell Unsuccessful. Please try again',
    });
  }
}

/**
 * Sets List of Section Cells in cache
 *
 * @public
 */
async function setSectionCellList() {
  const cellList = await cellPersistence.getAllCells();
  const formattedCellList = {};
  cellList.forEach((cell) => {
    if (cell.cell_name === 'uncelled') {
      formattedCellList[cell.cell_name] = cell.id;
    } else {
      if (!formattedCellList[cell.section_name]) {
        formattedCellList[cell.section_name] = {};
      }
      formattedCellList[cell.section_name][cell.cell_name] = cell.id;
    }
  });
  await cService.set(cService.cacheTables.GENERAL, 'cells', formattedCellList, CACHE_TTL);
  console.log(`Cell list set in cache: ${JSON.stringify(formattedCellList)}`);
  return null;
}

/**
 * Gets List of Cells by section from cache
 *
 * @param {string} sectionName
 *
 * @public
 *
 * @returns {{}} Objects of cells
 */
async function getSectionObj(sectionName) {
  const cellList = await cService.get(cService.cacheTables.GENERAL, 'cells');
  return cellList[sectionName];
}

async function getCellId(section, cell) {
  const cellList = await cService.get(cService.cacheTables.GENERAL, 'cells');
  if (section === 'uncelled') {
    return cellList[section];
  }
  return cellList[section][cell];
}

async function getSectionList() {
  const cellList = await cService.get(cService.cacheTables.GENERAL, 'cells');
  return Object.keys(cellList);
}

module.exports = {
  getCellId,
  getSectionList,
  getSectionObj,
  goToSubscriptionMainMenu,
  sendSubscriptionDetails,
  setSectionCellList,
  updateUserCell,
  updateUserSubscription,
};
