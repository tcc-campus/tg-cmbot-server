/* Modules to handle event notification from bot platform
*   Exported Modules:
*     1. handleEventNotification(eventNotification): Handle
*/
const tgCaller = require('../apiCallers/telegramCaller');
const evtFormatter = require('../formatters/eventFormatter');

function handleEventNotification(eventNotification) {
  console.log('Handing event notification from bot platform');
  return new Promise(((resolve, reject) => {
    const subscriberList = eventNotification.subscriber_list;
    const eventDetails = eventNotification.event_details;
    console.log('Formating event detail');
    const message = evtFormatter.getMessageForUpcomingEventDetail(eventDetails);
    tgCaller
      .sendMessageToList(subscriberList, message)
      .then((resultList) => {
        console.log(resultList);
        const errorList = resultList.filter(result => !result.message);
        if (errorList.length > 0) {
          const errMessage = `${errorList.length}/${
            subscriberList.length
          } messages failed to be sent: ${errorList}`;
          console.log(errMessage);
          reject(errMessage);
        } else {
          resolve('All messages successfully sent');
        }
      })
      .catch((error) => {
        reject(error);
      });
  }));
}

module.exports = {
  handleEventNotification,
};
