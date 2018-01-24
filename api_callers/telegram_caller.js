/* Modules to make API Calls to Telegram Server
*   Exported Modules:
*     1. setWebHook(): For setting bot webhook on Telegram Server
*     2. sendMessage(chatId, message, options): For sending messages to Telegram chats
*     3. sendMessageWithReply(chatId, messageId, message, replyType): For sending messages with force reply to Telegram chats
*/

const config = require('../config');
const request = require('request');

let cacheProvider = require('../cache_provider');

function setWebHook() {
  console.log("Setting Webhook on Telegram");
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/setWebhook`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        url: config.WEBHOOK_URL,
      },
      json: true,
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        resolve('Telegram Webhook Set');
      } else {
        reject(error);
      }
    });
  });
}

function sendMessage(chatId, message, options) {
  console.log("Sending Message to chat_id:" + chatId);
  let parseMode = '';
  let replyMarkup = {};
  if(options) {
    parseMode = options.parse_mode ? options.parse_mode : '';
    replyMarkup = options.force_reply ? options.force_reply : {};
  }
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/sendMessage`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
        reply_markup: replyMarkup,
      },
      json: true,
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        resolve('Message Sent to chat_id: ' + chatId);
      } else {
        reject(error);
      }
    });
  });
}

function sendMessageWithReply(chatId, messageId, message, replyType) {
  console.log("Forcing reply on message to be sent: " + chatId);

  sendMessage(chatId, message, {'parse_mode': 'markdown', 'force_reply': true}).then((result) => {
    console.log(result);
    console.log(`Setting cache for ${chatId} with cache key: ${messageId} and cache value: ${replyType}`)
    cacheProvider.instance().set(messageId, replyType, config.CACHE_DURATION, function(err, success) {
      if (success) {
        console.log("Cache successfully set");
      } else {
        console.log(err);
      }
    })
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = {
  setWebHook,
  sendMessage,
  sendMessageWithReply,
}
