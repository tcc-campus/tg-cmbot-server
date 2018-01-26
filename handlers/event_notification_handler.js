/* Modules to handle event notification from bot platform
*   Exported Modules:
*     1. handleEventNotification(eventNotification): Handle
*/
const pf_caller = require('../api_callers/platform_caller');

function handleEventNotification(eventNotification) {
  console.log("Handing event notification from bot platform");
  return new Promise(function(resolve, reject) {
    const subscriberList = eventNotification.subscriber_list;
    const eventDetails = eventNotification.event_details;
    const message = formatEventNotificationMessage(eventDetails);
    
  });
}

module.exports = {
  handleEventNotification,
}
