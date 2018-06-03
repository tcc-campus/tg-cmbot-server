/**
 * Service for Event Attendance
 */
const moment = require('moment');

const sCaller = require('../apiCallers/slackCaller');
const attUtil = require('../utils/attendanceUtil');

async function sendFeedback(chatId, firstName, feedbackMsg) {
  console.log("Sending feedback to developers on Slack");
  const data = {
    attachments: [{
      fallback: `Hey Developers! Feedback received from ${firstName}: ${feedbackMsg}`,
      pretext: 'Hey Developers! Feedback received:',
      color: '#0092FF',
      fields: [{
        title: 'Name',
        value: firstName,
        short: true,
      }, {
        title: 'Telegram ID',
        value: chatId,
        short: true,
      }, {
        title: 'Feedback Message',
        value: feedbackMsg,
        short: false,
      }],
      footer: 'Campus Telegram Bot',
      ts: moment().unix(),
    }],
  };
  await sCaller.postToSlack(data);
}

module.exports = {
  sendFeedback,
};
