/* Modules to handle message events from Telegram
*   Exported Modules:
*     1. handleMessageEvent(msgObj): Handle Telegram Message Event
*/
const tg_caller = require('../api_callers/telegram_caller');
const cmd_handler = require('./command_handler');

function handleMessageEvent(msgObj) {
  console.log("Handling Telegram Message Event")
  const chatId = msgObj.chat.id;
  const text = msgObj.text.trim();
  if (isCommandReceived(text)) {
    const command = text.substr(1);
    console.log("Command Detected: " + command);
    cmd_handler.handleCommand(chatId, msgObj, command);
  } else {
    console.log("Echoing Message")
    tg_caller.sendMessage(chatId, text, {}).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
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
