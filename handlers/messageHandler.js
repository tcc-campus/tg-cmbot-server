/* Modules to handle message events from Telegram
*   Exported Modules:
*     1. handleMessageEvent(msgObj): Handle Telegram Message Event
*/
const tgCaller = require('../apiCallers/telegramCaller');
const cmdHandler = require('./commandHandler');
const rpHandler = require('./replyHandler');

function handleMessageEvent(msgObj) {
  console.log("Handling Telegram Message Event")
  const chatId = msgObj.chat.id;
  let text = msgObj.text;
  if (text) {
    text = text.trim();
    if (isReply(msgObj)) {
      console.log("Reply Detected");
      rpHandler.handleReply(chatId, msgObj);
    } else if (isCommandReceived(text)) {
      const command = text.split('@')[0].substr(1);
      console.log("Command Detected: " + command);
      cmdHandler.handleCommand(chatId, msgObj, command);
    } else {
      console.log("Echoing Message")
      tgCaller.sendMessage(chatId, text).catch((error) => {
        console.log(error);
      });
    }
  } else {
    console.log("Unhandled Message Event received: " + msgObj);
  }
}

function isReply(msgObj) {
  if(msgObj.reply_to_message) {
    return true;
  } else {
    return false;
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
