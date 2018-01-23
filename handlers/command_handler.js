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
    case 'upcoming':
      response = "I'll send you upcoming events when I have them";
      handleOtherCommands(chatId, response);
      break;
    case 'subscribe':
      response = "Thanks for your interest, subscription will be available soon!";
      handleOtherCommands(chatId, response);
      break;
    case 'unsubscribe':
      response = "If you can't subscribe, you can't unsubscribe :P";
      handleOtherCommands(chatId, response);
      break;
    case 'help':
      response = "Help is coming soon...";
      handleOtherCommands(chatId, response);
      break;
    default:
      handleUnknownCommand(chatId);
      break;
  }


  tg_caller.sendMessage(chatId, response).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function handleStart(chatId, firstName) {
  const message = `Hello ${firstName}! I'm Campus Ministry Bot. Type /help or click on the slash button below to know the commands you can use!`;

  tg_caller.sendMessage(chatId, message).then((result) => {
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
