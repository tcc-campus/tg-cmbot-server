/* Modules to handle commands from Telegram
*   Exported Modules:
*     1. handleCommand(chatId, msgobj, command): Invoke handler for respective command received
*/

const tg_caller = require('../api_callers/telegram_caller');
const pf_caller = require('../api_callers/platform_caller');
const dt_util = require('../utils/date_time_util');
const evt_formatter = require('../utils/event_formatter');
const msg_formatter = require('../utils/message_formatter');

function handleCommand(chatId, msgObj, command) {
  console.log("Handling Command: " + command)
  const firstName = msgObj.chat.first_name ? msgObj.chat.first_name : '';

  switch(command) {
    case 'start':
      handleStart(chatId, firstName);
      break;
    case 'upcoming':
      handleUpcoming(chatId);
      break;
    case 'subscribe':
      handleSubscribe(chatId, firstName);
      break;
    case 'unsubscribe':
      handleUnsubscribe(chatId, firstName);
      break;
    case 'feedback':
      handleFeedback(chatId);
      break;
    case 'help':
      handleHelp(chatId);
      break;
    default:
      response = "Oops sorry, I don't understand the command. Type /help to get a list of available commands 😁"
      handleUnknownCommand(chatId, response);
      break;
  }
}

function handleStart(chatId, firstName) {
  const message = `Hello ${firstName}! I'm Campus Ministry Bot. Type /help or click on the slash button below to know the commands you can use!`;

  tg_caller.sendMessage(chatId, message).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

function handleUpcoming(chatId) {
  const dateRange = dt_util.getDateRangeForThisMonth();
  console.log("Date range for this month: " + JSON.stringify(dateRange));
  pf_caller.getUpcomingEvents(dateRange.start_date, dateRange.end_date).then((result) => {
    console.log(result.message);
    const eventList = result.body;
    console.log(eventList);
    for (var i=0; i<eventList.length; i++) {
      console.log(eventList[i]);
    }
    if (eventList.length > 0) {
      const message = msg_formatter.formatUpcomingMessage(evt_formatter.formatEventList(result.body));
    } else {
      const message = "There are no upcoming events this month!";
    }
    tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  })
}

function handleSubscribe(chatId, firstName) {
  const successMessage = `Thanks for subscribing, ${firstName}! I'll keep you updated on upcoming Campus Ministry Events. Type /unsubscribe if you no longer want updates. God Bless!`;
  const failureMessage = `I'm sorry, ${firstName}, there was an error registering your subscription. Please try again!`

  console.log(`Sending new subscriber request to backend: ${chatId}, ${firstName}`);

  pf_caller.postSubscriber(chatId, firstName).then((result) => {
    console.log(result);
    tg_caller.sendMessage(chatId, successMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
    tg_caller.sendMessage(chatId, failureMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  })
}

function handleUnsubscribe(chatId, firstName) {
  const successMessage = `Sure, ${firstName}, I will stop sending you updates. You can always type /subscribe if you want me to update you again! God Bless!`;
  const failureMessage = `I'm sorry, ${firstName}, there was an error unsubscribing you from my list. Please try again!`

  console.log(`Sending unsubscribe request to backend for id: ${chatId}`);

  pf_caller.deleteSubscriber(chatId).then((result) => {
    console.log(result);
    tg_caller.sendMessage(chatId, successMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
    tg_caller.sendMessage(chatId, failureMessage).then((result) => {
      console.log(result.message);
    }).catch((error) => {
      console.log(error);
    });
  })
}

function handleFeedback(chatId) {
  const message = "Please let me know how I can improve by replying to this message 🙏🏻";
  const replyType = 'feedback_reply'
  tg_caller.sendMessageWithReply(chatId, message, replyType);
}

function handleHelp(chatId) {
  const message = "I can give you reminders on Campus Ministry Events or let you know about upcoming events.😁 \n\n*Available Commands:*\n/upcoming - Get a list of upcoming events\n/subscribe - Subscribe to push notifications on upcoming Campus Events \n/unsubscribe - Unsubscribe from push notifications\n/feedback - Give me feedback\n/help - Get help!";

  tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

function handleUnknownCommand(chatId) {
  const message = "Sorry, I don't understand this command. Type /help or click on the slash button below to get the list of available commands!"
  tg_caller.sendMessage(chatId, message, {'parse_mode': 'markdown'}).then((result) => {
    console.log(result.message);
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = {
  handleCommand,
}
