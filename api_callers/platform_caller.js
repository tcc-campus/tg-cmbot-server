/* Modules to make API Calls to CMBot Platform
*   Exported Modules:
*     1. postSubscribe(chatId, firstName): For adding new subscriber to database
*
*/

const config = require('../config');
const request = require('request');

function postSubscribe(chatId, firstName) {
  return new Promise(function(resolve, reject) {
    const url = `${config.PLATFORM_URL}/subscribe`;
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

module.exports = {
  postSubscribe,
}
