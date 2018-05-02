/* Modules to handle message replies from Telegram
*   Exported Modules:
*     1. handleReply(chatId, msgObj): Handle Telegram Message Reply
*/
const tgCaller = require('../apiCallers/telegramCaller');
const config = require('../config');
const cUtil = require('../utils/cacheUtil');

function handleReply(chatId, msgObj) {
  const replyId = msgObj.reply_to_message.message_id;
  const firstName = msgObj.chat.first_name || '';
  console.log("Handling reply to message: " + replyId);
  const cacheObj = cUtil.getCacheObj(replyId);
  if (cacheObj) {
    console.log("Cache Object: " + JSON.stringify(cacheObj));
    const replyType = cacheObj.type;
    const replyCacheData = cacheObj.data;
    if (replyType) {
      console.log("Reply type detected: " + replyType);
      switch(replyType) {
        case cUtil.REPLY_TYPE.FEEDBACK:
          handleFeedbackReply(chatId, firstName, msgObj);
          break;
        default:
          console.log("Unknown reply type");
          break;
        }
    } else {
      console.log("No reply found from cache key");
    }
  } else {
    console.log("Cache key-value doesn't exist!");
  }

}

function handleFeedbackReply(chatId, firstName, msgObj) {
  const feedbackMsg = msgObj.text;
  console.log("Feedback received: " + feedbackMsg);
  const message = `Thanks ${firstName} for your feedback. I will let my developer know so I can improve! 😊`;
  tgCaller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
    console.log("Sending feedback to developers");
    const feedbackMsgForDev = `Hey Developers! Feedback received from ${firstName}:\n\n"${feedbackMsg}"`;
    tgCaller.sendMessage(config.DEV_GROUP_ID, feedbackMsgForDev, {'parse_mode': 'markdown'}).then((result) => {
      console.log(result.message);
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
}

module.exports = {
  handleReply,
}
