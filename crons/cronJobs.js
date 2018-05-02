/* Cron Jobs to run
*   Exported Modules:
*     1. sendPushNotification(): For starting a cron job to get push notifications if any
*/
const moment = require('moment');
const evtFormatter = require('../utils/eventFormatter');
const msgFormatter = require('../utils/messageFormatter');
const tgCaller = require('../apiCallers/telegramCaller');
const pfCaller = require('../apiCallers/platformCaller');

function sendPushNotification() {
  return new Promise(function(resolve, reject) {
    const startDate = moment().add(3, 'days').format("YYYY-MM-DD");
    const endDate = moment().add(4, 'days').format("YYYY-MM-DD");
    pfCaller.getUpcomingEvents(startDate, endDate).then((result) => {
      const eventList = JSON.parse(result.body);
      if(eventList.length < 1) {
        console.log("No events found for:", startDate);
        resolve();
      } else {
        evtFormatter.formatEventList(eventList).then(formattedEventList => {
          //Assume only one event in list
          const msgToSend = msgFormatter.formatEventDetail(formattedEventList[0]);
          pfCaller.getListOfSubscribers().then((result) => {
            console.log(result.message);
            const subscriberList = result.body;
            tgCaller.sendMessageToList(subscriberList, msgToSend).then((resultList) => {
              console.log(resultList);
              const errorList = resultList.filter((result) => !result.message);
              if (errorList.length > 0) {
                const errMessage = `${errorList.length}/${subscriberList.length} messages failed to be sent: ${errorList}`;
                console.log(errMessage);
                reject();
              } else {
                resolve();
              }
            }).catch((error) => {
              reject(error);
            })
          })
        })
      }
    })
  });
}

module.exports = {
  sendPushNotification,
}
