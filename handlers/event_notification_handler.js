/* Modules to handle event notification from bot platform
*   Exported Modules:
*     1. handleEventNotification(eventNotification): Handle
*/
const tg_caller = require('../api_callers/telegram_caller');
const msg_formatter = require('../utils/message_formatter');

function handleEventNotification(eventNotification) {
  console.log("Handing event notification from bot platform");
  return new Promise(function(resolve, reject) {
    const subscriberList = eventNotification.subscriber_list;
    const eventDetails = eventNotification.event_details;
    console.log("Formating event detail");
    const message = msg_formatter.formatEventDetail(eventDetails);
    tg_caller.sendMessageToList(subscriberList, message).then((result) => {
      console.log(result);
      resolve(result)
    }).catch((error) => {
      reject(error);
    })
  });
}

module.exports = {
  handleEventNotification,
}
