/* Modules to handle commands from Telegram
*   Exported Modules:
*     1. handleCommand(chatId, msgobj, command): Invoke handler for respective command received
*/

const tgCaller = require('../apiCallers/telegramCaller');
const subService = require('../services/subscriptionService');
const upcomingUtil = require('../utils/upcomingUtil');

async function handleStart(chatId, firstName) {
  const message = `Hello ${firstName}! I'm Campus Ministry Bot. Type /help or click on the slash button below to know the commands you can use!`;
  await tgCaller.sendMessage(chatId, message).catch((error) => {
    console.log(error);
  });
}

async function handleUpcoming(chatId) {
  const message = await upcomingUtil.getMessage('main_menu');
  const inlineKeyboardButtonList = await upcomingUtil.getInlineKeyboard('main_menu');
  tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList);
}

function handleSubscription(chatId, firstName) {
  subService.sendSubscriptionDetails(chatId, firstName);
}

async function handleFeedback(chatId) {
  const message = 'Please let me know how I can improve by replying to this message 🙏🏻';
  await tgCaller.sendMessageWithReply(chatId, message).catch((error) => {
    console.log(error);
  });
}

async function handleHelp(chatId) {
  const message =
    'I can give you reminders on Campus Ministry Events or let you know about upcoming events.😁 \n\n*Available Commands:*\n/upcoming - Get a list of upcoming events\n/subscription - Manage your subscription details\n/feedback - Give me feedback\n/help - Get help!';
  await tgCaller.sendMessage(chatId, message, { parse_mode: 'markdown' }).catch((error) => {
    console.log(error);
  });
}

async function handleUnknownCommand(chatId) {
  const message =
    "Sorry, I don't understand this command. Type /help or click on the slash button below to get the list of available commands! 😁";
  await tgCaller.sendMessage(chatId, message, { parse_mode: 'markdown' }).catch((error) => {
    console.log(error);
  });
}

function handleCommand(chatId, msgObj, command) {
  console.log(`Handling Command: ${command}`);
  const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : '';

  switch (command) {
    case 'start':
      handleStart(chatId, firstName);
      break;
    case 'upcoming':
      handleUpcoming(chatId);
      break;
    case 'subscription':
      handleSubscription(chatId, firstName);
      break;
    case 'feedback':
      handleFeedback(chatId);
      break;
    case 'help':
      handleHelp(chatId);
      break;
    default:
      handleUnknownCommand(chatId);
      break;
  }
}

module.exports = {
  handleCommand,
};
