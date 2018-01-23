/* Modules to make API Calls to Telegram Server
*   Exported Modules:
*     1. setWebHook(): For setting bot webhook on Telegram Server
*     2. sendMessage(chatId, message): For sending messages to Telegram chats
*/

const config = require('../config');
const request = require('request');

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
  return new Promise(function(resolve, reject) {
    const url = `${config.TELEGRAM_API_URL}/sendMessage`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        chat_id: chatId,
        text: message,
        parse_mode: options.parse_mode ? options.parse_mode : '',
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

module.exports = {
  setWebHook,
  sendMessage,
}
