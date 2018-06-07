/* Modules to handle events from external servers
*   Exported Modules:
*     1. handleTgEvent(eventObj): For handling telegram Events
*/

const msgHandler = require('./messageHandler');
const cqHandler = require('./callbackQueryHandler');
const userPersistence = require('../persistence/users');

async function handleTgEvent(eventObj) {
  console.log('Handling Telegram Event');
  let chatId = '';
  let firstName = '';
  let lastName = '';
  if (eventObj.message) {
    chatId = eventObj.message.chat.id;
    firstName = eventObj.message.chat.first_name;
    lastName = eventObj.message.chat.last_name;
    msgHandler.handleMessageEvent(eventObj.message);
  } else if (eventObj.edited_message) {
    console.log('edited_message event detected');
  } else if (eventObj.channel_post) {
    console.log('channel_post event detected');
  } else if (eventObj.edited_channel_post) {
    console.log('edited_channel_post event detected');
  } else if (eventObj.inline_query) {
    console.log('inline_query event detected');
  } else if (eventObj.chosen_inline_result) {
    console.log('chosen_inline_result event detected');
  } else if (eventObj.callback_query) {
    chatId = eventObj.callback_query.message.chat.id;
    firstName = eventObj.callback_query.message.chat.first_name;
    lastName = eventObj.callback_query.message.chat.last_name;
    cqHandler.handleCallbackQueryEvent(eventObj.callback_query);
  } else {
    console.log('unknown event detected');
  }
  if (chatId && firstName) {
    const user = await userPersistence.getUser(chatId);
    const userName = `${firstName} ${lastName || ''}`;
    if (user) {
      await userPersistence.updateUser(chatId, { telegram_name: userName }).catch((error) => {
        console.log(error);
      });
    } else {
      await userPersistence.createUser(chatId, userName).catch((error) => {
        console.log(error);
      });
    }
  }
}

module.exports = {
  handleTgEvent,
};
