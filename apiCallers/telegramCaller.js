/* Modules to make API Calls to Telegram Server
*   Exported Modules:
*     1. setWebHook(): For setting bot webhook on Telegram Server
*     2. sendMessage(chatId, message, options): For sending messages to Telegram
*        chats
*     3. editMessage(chatId, msgId, editedMessage, options): For editing messages
*        sent by bot to user
*     4. editInlineKeyboardOnly(chatId, msgId, inlineKeyboardButtonList): For
*        editing the inline keyboard only
*     5. sendMessageWithReply(chatId, message, replyType): For sending messages
*        with force reply to Telegram chats
*     6. sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList,
*        callbackQueryType): For sending messages with inline keyboard to telegram
*        chats
*     7. sendChatAction(chatId, action): For sending chat actions to telegram user
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

function editMessage(chatId, msgId, editedMessage, options) {
  console.log(`Editing Message[${msgId}] for chat_id: ${chatId}`);
  let parseMode = '';
  let replyMarkup = {};
  if(options) {
    parseMode = options.parse_mode || '';
    replyMarkup = options.force_reply || options.inline_keyboard || {};

  }
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/editMessageText`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        chat_id: chatId,
        message_id: msgId,
        text: editedMessage,
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
          reject("Failed to edit message at " + chatId + ": " + JSON.stringify(body));
        }
      }, 200);
    });
  });
}

function editInlineKeyboardOnly(chatId, msgId, inlineKeyboardButtonList) {
  console.log(`Editing InlineKeyboard for message[${msgId}] for chat_id: ${chatId}`);
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/editMessageReplyMarkup`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        chat_id: chatId,
        message_id: msgId,
        reply_markup: {
          inline_keyboard: inlineKeyboardButtonList,
        },
      },
      json: true,
    };

    request(options, function(error, response, body) {
      setTimeout(() => {
        if(!error && response.statusCode == 200) {
          const message = 'Message Sent to chat_id: ' + chatId;
          resolve({message: message, body: body});
        } else {
          reject("Failed to edit inline_keyboard at " + chatId + ": " + JSON.stringify(body));
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

async function sendMessageToList(chatIdList, message) {
  console.log("Sending message to list of chatIds " + chatIdList);
  return new Promise(async function(resolve, reject) {
    try {
      for(var i=0; i<chatIdList.length; i++) {
        await sendMessage(chatId, message, {'parse_mode': 'markdown'})
      }
      resolve('Message successfully sent to list of chatIds');
    } catch(error) {
      reject(error)
    }
  });
}

module.exports = {
  setWebHook,
  sendMessage,
  editMessage,
  editInlineKeyboardOnly,
  sendMessageWithReply,
  sendMessageWithInlineKeyboard,
  sendMessageToList,
  sendChatAction,
}
