const tg_caller = require('../api_callers/telegram_caller');

function handleEvent(eventObj) {
  const chatId = eventObj.message.chat.id;
  const text = eventObj.message.text;
  console.log("Echoing Message")
  tg_caller.sendMessage(chatId, text).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  })
}

module.exports = {
  handleEvent,
}
