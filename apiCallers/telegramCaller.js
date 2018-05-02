/* Modules to make API Calls to Telegram Server
*   Exported Modules:
*     1. setWebHook(): For setting bot webhook on Telegram Server
*     2. sendMessage(chatId, message, options): For sending messages to Telegram
*        chats
*     3. sendMessageWithReply(chatId, message, replyType): For sending messages
*        with force reply to Telegram chats
*     4. sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList,
*        callbackQueryType): For sending messages with inline keyboard to telegram
*        chats
*     5. sendChatAction(chatId, action): For sending chat actions to telegram user
*/

const config = require('../config');
const request = require('request');

let cacheProvider = require('../cacheProvider');

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
      setTimeout(() => {
        if(!error && response.statusCode == 200) {
          const message = 'Message Sent to chat_id: ' + chatId;
          resolve({message: message, body: body});
        } else {
          reject("Failed to send message to " + chatId + ": " + error);
        }
      }, 200);
    });
  });
}

function sendMessageWithReply(chatId, message, replyType, replyTypeData) {
  console.log("Forcing reply on message to be sent: " + chatId);

  sendMessage(chatId, message, {'parse_mode': 'markdown', 'force_reply': {'force_reply': true}}).then((result) => {
    console.log(result.message);
    messageId = result.body.result.message_id;
    console.log(`Setting cache for ${chatId} with cache key: ${messageId} and cache value: ${replyType}`)
    const cacheValue = {
      type: replyType,
      data: replyTypeData,
    }
    cacheProvider.instance().set(messageId, cacheValue, config.CACHE_DURATION, function(err, success) {
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

function sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList, callbackQueryType, callbackQueryTypeValue) {
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
    const cacheValue = {
      type: callbackQueryType,
      data: callbackQueryTypeValue,
    }
    cacheProvider.instance().set(messageId, cacheValue, config.CACHE_DURATION, function(err, success) {
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

function sendChatAction(chatId, action) {
  console.log(`Sending chat action (${action}) to chat_id: ${chatId}`);
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/sendChatAction`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        chat_id: chatId,
        action: action,
      },
      json: true,
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        const message = 'Chat action sent to chat_id: ' + chatId;
        resolve(message);
      } else {
        reject(error);
      }
    });
  });
}

function sendMessageToList(chatIdList, message) {
  console.log("Sending message to list of chatIds " + chatIdList);
  return new Promise(function(resolve, reject) {
    let sendMessageTaskList = chatIdList.map((chatId) => {
      return new Promise(function(resolve, reject) {
        sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
          resolve(result);
        }).catch((error) => {
          console.log(error);
          reject(chatId);
        })
      });
    });

    Promise.all(sendMessageTaskList.map(p => p.catch(err => err))).then((result) => {
      console.log("Message sending task completed");
      resolve(result);
    }).catch((error) => {
      console.log(error);
      reject(error);
    })
  });
}

module.exports = {
  setWebHook,
  sendMessage,
  sendMessageWithReply,
  sendMessageWithInlineKeyboard,
  sendMessageToList,
  sendChatAction,
}
