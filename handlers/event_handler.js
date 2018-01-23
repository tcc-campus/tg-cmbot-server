/* Modules to handle events from external servers
*   Exported Modules:
*     1. handleTgEvent(eventObj): For handling telegram Events
*/

const msg_handler = require('./message_handler');

function handleTgEvent(eventObj) {
  console.log("Handling Telegram Event");
  if (eventObj.message) {
    msg_handler.handleMessageEvent(eventObj.message);
  } else if (eventObj.edited_message) {
      console.log("edited_message event detected");
  } else if (eventObj.channel_post ) {
      console.log("channel_post event detected");
  } else if (eventObj.edited_channel_post) {
      console.log("edited_channel_post event detected");
  } else if (eventObj.inline_query) {
      console.log("inline_query event detected");
  } else if (eventObj.chosen_inline_result) {
      console.log("chosen_inline_result event detected");
  } else {
      console.log("unknown event detected");
  }
}

module.exports = {
  handleTgEvent,
}
