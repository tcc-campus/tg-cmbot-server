/* Modules to handle commands from Telegram
*   Exported Modules:
*     1. handleCommand(chatId, msgobj, command): Invoke handler for respective command received
*/

const tg_caller = require('../api_callers/telegram_caller');

function handleCommand(chatId, msgObj, command) {
  console.log("Handling Command: " + command)
  const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : '';

  switch(command) {
    case 'start':
      handleStart(chatId, firstName);
      break;
    case 'upcoming':
      response = "I'll send you upcoming events when I have them";
      handleOtherCommands(chatId, response);
      break;
    case 'subscribe':
      handleSubscribe(chatId, firstName);
      break;
    case 'unsubscribe':
      response = "Sure, I will stop sending you updates. You can always type /subscribe if you want me to update you again!";
      handleOtherCommands(chatId, response);
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

  tg_caller.sendMessage(chatId, message).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function handleSubscribe(chatId, firstName) {
  const message = `Thanks for subscribing, ${firstName}! I'll keep you updated on upcoming Campus Ministry Events. \
  Type /unsubscribe if you no longer want updates. God Bless!`;

  console.log(`Send subscriber info - ${chatId} and ${firstName} to backend`);

  tg_caller.sendMessage(chatId, message).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function handleHelp(chatId) {
  const message = "I can give you reminders on Campus Ministry Events or let you know about upcoming events.😁 \n\n \
  *Available Commands:*\n \
  /upcoming - Get a list of upcoming events\n \
  /subscribe - Subscribe to push notifications on upcoming Campus Events \n \
  /unsubscribe - Unsubscribe from push notifications\n \
  /help - Get help!";

  tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function handleOtherCommands(chatId, message) {

  tg_caller.sendMessage(chatId, message).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function handleUnknownCommand(chatId) {
  const message = "Sorry, I don't understand this command. Type /help or click on the slash button below to get the list of available commands!"
  tg_caller.sendMessage(chatId, message).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = {
  handleCommand,
}
