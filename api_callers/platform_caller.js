/* Modules to make API Calls to CMBot Platform
*   Exported Modules:
*     1. postSubscriber(chatId, firstName): For adding new subscriber to database
*     2. deleteSubscriber(chatId): For deleting given subscriber from database
*     3. getUpcomingEvents(startDate, endDate): For getting upcoming events in given date range
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

function getUpcomingEvents(startDate, endDate) {
  console.log("Getting upcoming events from platform");
  return new Promise(function(resolve, reject) {
    // const url = `${config.PLATFORM_URL}/upcoming`;
    const url = "https://tcc-campus-platform.herokuapp.com/platform528402819:AAE_ODuTR-bsB0yCeH77_Sy3VoIpSYBA1mM/upcoming"
    const options = {
      method: 'get',
      url: url,
      qs: {
        start_date: startDate,
        end_date: endDate,
      }
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        const message = `Got upcoming events for: ${startDate} to ${endDate}`
        resolve({message: message, body: body});
      } else {
        reject(error);
      }
    });
  });
}

function getListOfSubscribers() {
  return new Promise(function(resolve, reject) {
    // const url = `${config.PLATFORM_URL}/subscriber`;
    const url = "https://tcc-campus-platform.herokuapp.com/platform528402819:AAE_ODuTR-bsB0yCeH77_Sy3VoIpSYBA1mM/subscriber"
    const options = {
      method: 'get',
      url: url,
      json: true,
    };

    request(options, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        const message = "List of Subscribers: " + JSON.stringify(body);
        resolve({message: message, body: body});
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  postSubscriber,
  deleteSubscriber,
  getUpcomingEvents,
  getListOfSubscribers,
}
