/* Modules to handle commands from Telegram
*   Exported Modules:
*     1. handleCommand(chatId, msgobj, command): Invoke handler for respective command received
*/

const tgCaller = require('../apiCallers/telegramCaller');
const pfCaller = require('../apiCallers/platformCaller');
const cUtil = require('../utils/cacheUtil');
const upcomingUtil = require('../utils/upcomingUtil');

function handleCommand(chatId, msgObj, command) {
  console.log("Handling Command: " + command)
  const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : '';

  switch(command) {
    case 'start':
      handleStart(chatId, firstName);
      break;
    case 'upcoming':
      handleUpcoming(chatId);
      break;
    case 'subscribe':
      handleSubscribe(chatId, firstName);
      break;
    case 'unsubscribe':
      handleUnsubscribe(chatId, firstName);
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

function handleStart(chatId, firstName) {
  const message = `Hello ${firstName}! I'm Campus Ministry Bot. Type /help or click on the slash button below to know the commands you can use!`;

  tgCaller.sendMessage(chatId, message).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

async function handleUpcoming(chatId) {
  const message = await upcomingUtil.getMessage('main_menu');
  const inlineKeyboardButtonList = await upcomingUtil.getInlineKeyboard('main_menu');
  tgCaller.sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, cUtil.CALLBACK_QUERY_TYPE.UPCOMING_MONTH);
}

function handleSubscribe(chatId, firstName) {
  const successMessage = `Thanks for subscribing, ${firstName}! I'll keep you updated on upcoming Campus Ministry Events. Type /unsubscribe if you no longer want updates. God Bless!`;
  const failureMessage = `I'm sorry, ${firstName}, there was an error registering your subscription. Please try again!`

  console.log(`Sending new subscriber request to backend: ${chatId}, ${firstName}`);

  pfCaller.postSubscriber(chatId, firstName).then((result) => {
    console.log(result);
    tgCaller.sendMessage(chatId, successMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
    tgCaller.sendMessage(chatId, failureMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  })
}

function handleUnsubscribe(chatId, firstName) {
  const successMessage = `Sure, ${firstName}, I will stop sending you updates. You can always type /subscribe if you want me to update you again! God Bless!`;
  const failureMessage = `I'm sorry, ${firstName}, there was an error unsubscribing you from my list. Please try again!`

  console.log(`Sending unsubscribe request to backend for id: ${chatId}`);

  pfCaller.deleteSubscriber(chatId).then((result) => {
    console.log(result);
    tgCaller.sendMessage(chatId, successMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
    tgCaller.sendMessage(chatId, failureMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  })
}

function handleFeedback(chatId) {
  const message = "Please let me know how I can improve by replying to this message 🙏🏻";
  tgCaller.sendMessageWithReply(chatId, message, cUtil.REPLY_TYPE.FEEDBACK);
}

function handleHelp(chatId) {
  const message = "I can give you reminders on Campus Ministry Events or let you know about upcoming events.😁 \n\n*Available Commands:*\n/upcoming - Get a list of upcoming events\n/subscribe - Subscribe to push notifications on upcoming Campus Events \n/unsubscribe - Unsubscribe from push notifications\n/feedback - Give me feedback\n/help - Get help!";

  tgCaller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

function handleUnknownCommand(chatId) {
  const message = "Sorry, I don't understand this command. Type /help or click on the slash button below to get the list of available commands! 😁"
  tgCaller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = {
  handleCommand,
}
