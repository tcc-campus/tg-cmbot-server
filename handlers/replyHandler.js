/* Modules to handle message replies from Telegram
*   Exported Modules:
*     1. handleReply(chatId, msgObj): Handle Telegram Message Reply
*/
const tgCaller = require('../apiCallers/telegramCaller');
const config = require('../config');

const types = {
  FEEDBACK: 'feedback'
}

function handleReply(chatId, msgObj) {
  const replyId = msgObj.reply_to_message.message_id;
  const previousMsg = msgObj.reply_to_message.text;
  const firstName = msgObj.chat.first_name || '';
  console.log("Handling reply to message: " + previousMsg);
  const replyType = _getReplyType(previousMsg);
  console.log("Reply Type: ", replyType);
  switch(replyType) {
    case types.FEEDBACK:
      _handleFeedbackReply(chatId, firstName, msgObj);
      break;
    default:
      break;
  }
}

function _handleFeedbackReply(chatId, firstName, msgObj) {
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

function _getReplyType(previousMsg) {
  switch(previousMsg) {
    case 'Please let me know how I can improve by replying to this message 🙏🏻':
      return types.FEEDBACK;
    default:
      console.log("Reply to message not supported.");
      return null;
  }
}

module.exports = {
  handleReply,
}
