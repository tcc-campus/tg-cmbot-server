/* Modules to handle message replies from Telegram
*   Exported Modules:
*     1. handleReply(chatId, msgObj): Handle Telegram Message Reply
*/
const tg_caller = require('../api_callers/telegram_caller');
const config = require('../config');

let cacheProvider = require('../cache_provider');

function handleReply(chatId, msgObj) {
  const replyId = msgObj.reply_to_message.message_id;
  const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : '';
  console.log("Handling reply to message: " + replyId);
  const replyType = getReplyType(replyId);
  if (replyType) {
    console.log("Reply type detected: " + replyType);
    switch(replyType) {
      case 'feedback_reply':
        handleFeedbackReply(chatId, firstName, msgObj);
        break;
      default:
        console.log("Unknown reply type");
        break;
      }
  } else {
    console.log("No reply found from cache key");
  }
}

function handleFeedbackReply(chatId, firstName, msgObj) {
  const feedbackMsg = msgObj.text;
  console.log("Feedback received: " + feedbackMsg);
  const message = `Thanks ${firstName} for your feedback. I will let my developer know so I can improve! 😊`;
  tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
    console.log("Sending feedback to developers");
    const feedbackMsgForDev = `Hey Developers! Feedback received from ${firstName}:\n\n${feedbackMsg}`;
    tg_caller.sendMessage(config.DEV_GROUP_ID, feedbackMsgForDev, {'parse_mode': 'markdown'}).then((result) => {
      console.log(result.message);
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
}

function getReplyType(replyId) {
  console.log("Getting reply type with cache key: " + replyId);
  return cacheProvider.instance().get(replyId);
}

module.exports = {
  handleReply,
}
