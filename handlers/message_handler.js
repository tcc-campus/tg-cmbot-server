/* Modules to handle message events from Telegram
*   Exported Modules:
*     1. handleMessageEvent(msgObj): Handle Telegram Message Event
*/
const tg_caller = require('../api_callers/telegram_caller');

function handleMessageEvent(msgObj) {
  const chatId = msgObj.chat.id;
  const text = msgObj.text.trim();
  if (isCommandReceived(text)) {
    const command = text.substr(1);
    console.log("Command Detected: " + command);
    handleCommand(chatId, command);
  } else {
    console.log("Echoing Message")
    tg_caller.sendMessage(chatId, text).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}

function handleCommand(chatId, command) {
  let response = '';

  switch(command) {
    case 'upcoming':
      response = "I'll send you upcoming events when I have them";
      break;
    case 'subscribe':
      response = "Thanks for your interest, subscription will be available soon!";
      break;
    case 'unsubscribe':
      response = "If you can't subscribe, you can't unsubscribe :P";
      break;
    case 'help':
      response = "Help is coming soon...";
      break;
    default:
      break;
  }

  console.log("Handling Command: " + command)
  tg_caller.sendMessage(chatId, response).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

function isCommandReceived(text) {
  if (text.charAt(0) === '/') {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  handleMessageEvent,
}
