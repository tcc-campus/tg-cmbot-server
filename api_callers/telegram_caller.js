/* Modules to make API Calls to Telegram Server
*   Exported Modules:
*     1. setWebHook(): For setting bot webhook on Telegram Server
*     2. sendMessage(chatId, message, options): For sending messages to Telegram chats
*     3. sendMessageWithReply(chatId, message, replyType): For sending messages with force reply to Telegram chats
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
    parseMode = options.parse_mode || '';
    replyMarkup = options.force_reply || options.inline_keyboard || {};

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
        const message = 'Message Sent to chat_id: ' + chatId;
        resolve({message: message, body: body});
      } else {
        reject(error);
      }
    });
  });
}

function sendMessageWithReply(chatId, message, replyType) {
  console.log("Forcing reply on message to be sent: " + chatId);

  sendMessage(chatId, message, {'parse_mode': 'markdown', 'force_reply': {'force_reply': true}}).then((result) => {
    console.log(result.message);
    messageId = result.body.result.message_id;
    console.log(`Setting cache for ${chatId} with cache key: ${messageId} and cache value: ${replyType}`)
    cacheProvider.instance().set(messageId, replyType, config.CACHE_DURATION, function(err, success) {
      if (success) {
        console.log("Cache successfully set");
        console.log("List of cache keys: " + cacheProvider.instance().keys());
      } else {
        console.log(err);
      }
    })
  }).catch((error) => {
    console.log(error);
  });
}

function sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, callbackQueryType) {
  console.log("Sending message with inline keyoard: " + chatId);
  const sendOptions = {
    'parse_mode': 'markdown',
    'inline_keyboard' : {
      'inline_keyboard': inlineKeyboardButtonList,
    }
  }
  sendMessage(chatId, message, sendOptions).then((result) => {
    console.log(result.message);
    messageId = result.body.result.message_id;
    console.log(`Setting cache for ${chatId} with cache key: ${messageId} and cache value: ${callbackQueryType}`)
    cacheProvider.instance().set(messageId, callbackQueryType, config.CACHE_DURATION, function(err, success) {
      if (success) {
        console.log("Cache successfully set");
        console.log("List of cache keys: " + cacheProvider.instance().keys());
      } else {
        console.log(err);
      }
    })
  }).catch((error) => {
    console.log(error);
  })
}


function sendMessageToList(chatIdList, message) {
  console.log("Sending message to list of chatIds " + chatIdList);

}

module.exports = {
  setWebHook,
  sendMessage,
  sendMessageWithReply,
  sendMessageWithInlineKeyboard,
}
