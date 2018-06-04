/**
 * Service modules for User Subscription
 */

const tgCaller = require('../apiCallers/telegramCaller');
const userPersistence = require('../persistence/users');

function getMessageForSubscriptionDetails(firstName, user) {
  let message = `*Subscription Details for ${firstName}*\n\nStatus: `;
  if (user) {
    const cell = user.cell.cell_name === 'uncelled' ? '' : user.cell.cell_name;
    const section = user.cell.section_name || '';
    message += user.is_subscribed ? 'Subscribed\n' : 'Not Subscribed\n';
    message += `Section: ${section}\nCell: ${cell}`;
  } else {
    message += 'Not Subscribed\n';
    message += 'Section: \nCell:';
  }
  return message;
}

function getInlineKeyboardForSubscriptionDetails(user) {
  const inlineKeyboard = [[]];
  if (user && user.is_subscribed) {
    inlineKeyboard[0].push({ text: 'Unsubscribe', callback_data: 'subscription/unsubscribe' });
  } else {
    inlineKeyboard[0].push({ text: 'Subscribe', callback_data: 'subscription/subscribe' });
  }
  inlineKeyboard[0].push({ text: 'Edit Cell', callback_data: 'user/cell/edit' });
  return inlineKeyboard;
}

async function sendSubscriptionDetails(chatId, firstName) {
  try {
    [user] = await Promise.all([userPersistence.getUser(chatId), tgCaller.sendChatAction(chatId, 'typing')]);
    const message = getMessageForSubscriptionDetails(firstName, user);
    const inlineKeyboard = getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboard);
  } catch (error) {
    console.log(error);
  }
}

async function updateUserSubscription(chatId, messageId, callbackQueryId, isSubscribed) {
  const subscribeText = isSubscribed ? 'Subscription' : 'Unsubscribed';
  try {
    await userPersistence.updateUser(chatId, { is_subscribed: isSubscribed });
    [user] = await Promise.all([userPersistence.getUser(chatId),
      tgCaller.sendAnswerCallbackQuery(callbackQueryId, { text: `${subscribeText} Successfully!` })]);
    const message = getMessageForSubscriptionDetails(user.telegram_name, user);
    const inlineKeyboard = getInlineKeyboardForSubscriptionDetails(user);
    await tgCaller.editMessageWithInlineKeyboard(chatId, messageId, message, inlineKeyboard);
  } catch (error) {
    await tgCaller.sendAnswerCallbackQuery(callbackQueryId, { text: `${subscribeText} Unsuccessful. Please try again` });
  }
}

module.exports = {
  sendSubscriptionDetails,
  updateUserSubscription,
};
