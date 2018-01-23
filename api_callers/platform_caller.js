/* Modules to make API Calls to CMBot Platform
*   Exported Modules:
*     1. postSubscriber(chatId, firstName): For adding new subscriber to database
*     2. deleteSubscriber(chatId): For deleting given subscriber from database
*/

const config = require('../config');
const request = require('request');

function postSubscriber(chatId, firstName) {
  return new Promise(function(resolve, reject) {
    const url = `${config.PLATFORM_URL}/subscriber`;
    const options = {
      method: 'post',
      url: url,
      headers: {'content-type': 'application/json' },
      body: {
        telegram_id: chatId,
        telegram_name: firstName,
      },
      json: true,
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        resolve('New Subscriber Registered: ' + chatId);
      } else {
        reject(error);
      }
    });
  });
}

function deleteSubscriber(chatId) {
  return new Promise(function(resolve, reject) {
    const url = `${config.PLATFORM_URL}/subscriber`;
    const options = {
      method: 'delete',
      url: url,
      headers: {'content-type': 'application/json' },
      qs: {
        id: chatId
      }
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        resolve('Unsubscribed for id: ' + chatId);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  postSubscriber,
  deleteSubscriber,
}
