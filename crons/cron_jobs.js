/* Cron Jobs to run
*   Exported Modules:
*     1. sendPushNotification(): For starting a cron job to get push notifications if any
*/
const moment = require('moment');
const evt_formatter = require('../utils/event_formatter');
const msg_formatter = require('../utils/message_formatter');
const tg_caller = require('../api_callers/telegram_caller');
const pf_caller = require('../api_callers/platform_caller');

function sendPushNotification() {
  return new Promise(function(resolve, reject) {
    const startDate = moment().add(3, 'days').format("YYYY-MM-DD");
    const endDate = moment().add(4, 'days').format("YYYY-MM-DD");
    pf_caller.getUpcomingEvents(startDate, endDate).then((result) => {
      const eventList = JSON.parse(result.body);
      if(eventList.length < 1) {
        console.log("No events found for:", startDate);
        resolve();
      } else {
        evt_formatter.formatEventList(eventList).then(formattedEventList => {
          //Assume only one event in list
          const msgToSend = msg_formatter.formatEventDetail(formattedEventList[0]);
          pf_caller.getListOfSubscribers().then((result) => {
            console.log(result.message);
            const subscriberList = result.body;
            tg_caller.sendMessageToList(subscriberList, msgToSend).then((resultList) => {
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
