/**
 * APIs for Telegram Server
 */

const config = require('../config');
const axios = require('axios');
const async = require('async');
const sleep = require('await-sleep');

const randomUtil = require('../utils/randomUtil');

/**
 * Post request to Telegram Server
 * @param {string} tgMethod
 * @param {Object} payload
 *
 * @private
 */
async function postToTelegram(tgMethod, payload) {
  try {
    const response = await axios({
      url: `${config.TELEGRAM_API_URL}/${tgMethod}`,
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: payload,
    });
    if (response.status !== 200) {
      throw new Error(JSON.stringify(response.data));
    }
    return JSON.stringify(response.data);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Set Webhook on Telegram
 *
 * @public
 */
async function setWebHook() {
  console.log('Setting webhook on Telegram');
  try {
    await postToTelegram('setWebHook', {
      url: config.WEBHOOK_URL,
    });
    console.log('Telegram webhook set');
  } catch (error) {
    throw new Error(`Failed to set Telegram Webhook. ${error}`);
  }
}

/**
 * Send Message to Telegram User
 *
 * @param {string} chatId
 * @param {string} message
 * @param {Object} options (optional)
 *
 * @public
 */
async function sendMessage(chatId, message, options) {
  console.log('Sending Message to chat_id:', chatId);
  let parseMode = '';
  let replyMarkup = {};
  if (options) {
    parseMode = options.parse_mode || '';
    replyMarkup =
      options.force_reply ||
      options.inline_keyboard ||
      options.keyboard ||
      options.remove_keyboard ||
      {};
  }
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: parseMode,
    reply_markup: replyMarkup,
  };
  try {
    const result = await postToTelegram('sendMessage', payload);
    console.log(`Message sent to ${chatId}. ${result}`);
  } catch (error) {
    throw new Error(`Failed to send message to ${chatId}. ${error}`);
  }
}

/**
 * Send Message with Forced Reply to Telegram User
 *
 * @param {string} chatId
 * @param {string} message
 *
 * @public
 */
async function sendMessageWithReply(chatId, message) {
  console.log('Forcing reply on message to be sent:', chatId);
  await sendMessage(chatId, message, {
    parse_mode: 'markdown',
    force_reply: { force_reply: true },
  });
}

/**
 * Send Message with Inline Keyboard to Telegram User
 *
 * @param {string} chatId
 * @param {string} message
 * @param {Array} inlineKeyboardButtonList
 *
 * @public
 */
async function sendMessageWithInlineKeyboard(chatId, message, inlineKeyboardButtonList) {
  console.log('Sending message with inline keyboard:', chatId);
  const sendOptions = {
    parse_mode: 'markdown',
    inline_keyboard: {
      inline_keyboard: inlineKeyboardButtonList,
    },
  };
  await sendMessage(chatId, message, sendOptions);
}

/**
 * Send Message with Reply Keyboard to Telegram User
 *
 * @param {string} chatId
 * @param {string} message
 * @param {Array} replyKeyboardButtonList
 *
 * @public
 */
async function sendMessageWithReplyKeyboard(chatId, message, replyKeyboardButtonList) {
  console.log('Sending message with reply keyboard:', chatId);
  const sendOptions = {
    parse_mode: 'markdown',
    keyboard: {
      keyboard: replyKeyboardButtonList,
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };
  await sendMessage(chatId, message, sendOptions);
}

/**
 * Send Message with Reply Keyboard Removed to Telegram User
 *
 * @param {string} chatId
 * @param {string} message
 *
 * @public
 */
async function sendMessageWithReplyKeyboardRemoved(chatId, message) {
  console.log('Sending message with reply keyboard removed:', chatId);
  const sendOptions = {
    parse_mode: 'markdown',
    remove_keyboard: {
      remove_keyboard: true,
    },
  };
  await sendMessage(chatId, message, sendOptions);
}

/**
 * Send Message to List of Telegram Users.
 *
 * @param {array} chatIdList
 * @param {string} message
 *
 * @public
 */
async function sendMessageToList(chatIdList, message) {
  console.log('Sending message to list of chatIds:', chatIdList);

  const waitQueue = () => new Promise((resolve) => {
    const q = async.queue(async (chatId) => {
      try {
        await sendMessage(chatId, message, {
          parse_mode: 'markdown',
        });
        await sleep(randomUtil.getRandomIntInclusive(100, 300));
      } catch (error) {
        console.log(`Unable to send message to ${chatId}`);
      }
    }, 15);

    q.push(chatIdList);

    q.drain = () => {
      console.log('Message successfully sent to list of chatIds');
      resolve();
    };
  });

  await waitQueue();
}

/**
 * Edit a specified Telegram Message
 *
 * @param {string} chatId
 * @param {string} msgId
 * @param {string} editedMessage
 * @param {Object} options (optional)
 *
 * @public
 */
async function editMessage(chatId, msgId, editedMessage, options) {
  console.log(`Editing Message[${msgId}] for chat_id: ${chatId}`);
  let parseMode = '';
  let replyMarkup = {};
  if (options) {
    parseMode = options.parse_mode || '';
    replyMarkup = options.force_reply || options.inline_keyboard || {};
  }
  const payload = {
    chat_id: chatId,
    message_id: msgId,
    text: editedMessage,
    parse_mode: parseMode,
    reply_markup: replyMarkup,
  };
  try {
    const result = await postToTelegram('editMessageText', payload);
    console.log(`Message sent to ${chatId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to edit message at ${chatId}. ${error}`);
  }
}

/**
 * Edit a specified Telegram Message with Inline Keyboard and Message
 *
 * @param {string} chatId
 * @param {string} msgId
 * @param {string} editedMessage
 * @param {Array} editedInlineKeyboardButtonList
 *
 * @public
 */
async function editMessageWithInlineKeyboard(
  chatId,
  msgId,
  editedMessage,
  editedInlineKeyboardButtonList,
) {
  console.log('Editing message with inline keyboard:', chatId);
  const sendOptions = {
    parse_mode: 'markdown',
    inline_keyboard: {
      inline_keyboard: editedInlineKeyboardButtonList,
    },
  };
  await editMessage(chatId, msgId, editedMessage, sendOptions);
}

/**
 * Edit a specified Telegram Message with only Inline Keyboard
 *
 * @param {string} chatId
 * @param {string} msgId
 * @param {Array} inlineKeyboardButtonList
 *
 * @public
 */
async function editInlineKeyboardOnly(chatId, msgId, inlineKeyboardButtonList) {
  console.log(`Editing InlineKeyboard for message[${msgId}] for chat_id: ${chatId}`);
  const payload = {
    chat_id: chatId,
    message_id: msgId,
    reply_markup: {
      inline_keyboard: inlineKeyboardButtonList,
    },
  };
  try {
    const result = await postToTelegram('editMessageReplyMarkup', payload);
    console.log(`Message sent to ${chatId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to edit inline_keyboard at ${chatId}. ${error}`);
  }
}

/**
 * Sends a Chat Action to a Telegram User
 * Available Actions: typing, upload_photo, record_video, upload_video,
 * record_audio, upload_audio, upload_document, find_location, record_video_note,
 * upload_video_note
 *
 * @param {string} chatId
 * @param {string} actionToSend
 *
 * @public
 */
async function sendChatAction(chatId, actionToSend) {
  console.log(`Sending chat action (${actionToSend}) to chat_id: ${chatId}`);
  const payload = {
    chat_id: chatId,
    action: actionToSend,
  };
  try {
    const result = await postToTelegram('sendChatAction', payload);
    console.log(`Message sent to ${chatId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to send chat action to ${chatId}. ${error}`);
  }
}

/**
 * Send Answer Callback Query to Telegram User.
 * Use this method whenever the Telegram User clicks on a button.
 *
 * @param {string} callbackQueryId
 * @param {object} callbackOptions
 *
 * @public
 */
async function sendAnswerCallbackQuery(callbackQueryId, callbackOptions) {
  console.log(`Sending answer callback query (${JSON.stringify(callbackOptions)}) to callback query: ${callbackQueryId}`);
  let payload = {
    callback_query_id: callbackQueryId,
    cache_time: 10,
  };
  if (callbackOptions) {
    payload = Object.assign({}, payload, callbackOptions);
  }
  try {
    const result = await postToTelegram('answerCallbackQuery', payload);
    console.log(`Answer Callback Query sent to callback_query_id: ${callbackQueryId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to send answer callback query to ${callbackQueryId}. ${error}`);
  }
}

/**
 * Send a Photo to a Telegram User
 * @param {string} chatId
 * @param {string} imgUrl
 *
 * @public
 */
async function sendPhoto(chatId, imgUrl) {
  console.log(`Sending photo (${imgUrl}) to ${chatId}`);
  await sendChatAction(chatId, 'upload_photo').catch((error) => {
    console.log(error);
  });
  const payload = {
    chat_id: chatId,
    photo: imgUrl,
  };
  try {
    const result = await postToTelegram('sendPhoto', payload);
    console.log(`Photo Sent to chat_id: ${chatId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to send photo to ${chatId}. ${error}`);
  }
}

/**
 * Send response to Inline Query by a Telegram User
 *
 * @param {string} inlineQueryId
 * @param {Array} resultList
 *
 * @public
 */
async function sendAnswerInlineQuery(inlineQueryId, resultList) {
  console.log(`Sending answer to inline query ${inlineQueryId}`);
  const payload = {
    inline_query_id: inlineQueryId,
    results: resultList,
  };
  try {
    const result = await postToTelegram('answerInlineQuery', payload);
    console.log(`Answer sent to inline query: ${inlineQueryId}. ${result}`);
  } catch (error) {
    throw new Error(`Error: Failed to send answer to inline query ${inlineQueryId}. ${error}`);
  }
}

module.exports = {
  setWebHook,
  sendMessage,
  editMessage,
  editMessageWithInlineKeyboard,
  editInlineKeyboardOnly,
  sendMessageWithReply,
  sendMessageWithInlineKeyboard,
  sendMessageToList,
  sendChatAction,
  sendAnswerCallbackQuery,
  sendPhoto,
  sendAnswerInlineQuery,
  sendMessageWithReplyKeyboard,
  sendMessageWithReplyKeyboardRemoved,
};
