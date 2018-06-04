/**
 * Service for Event Attendance
 */
const moment = require('moment');

const sCaller = require('../apiCallers/slackCaller');
const attUtil = require('../utils/attendanceUtil');

async function sendFeedback(chatId, firstName, feedbackMsg) {
  console.log('Sending feedback to developers on Slack');
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
  await sCaller.postToDevelopersChannel(data);
}

async function sendAddEventForm(commandObj) {
  const data = {
    trigger_id: commandObj.trigger_id,
    dialog: {
      callback_id: 'new-event-form',
      title: 'Add New Event',
      submit_label: 'Add',
      notify_on_cancel: true,
      elements: [{
        type: 'text',
        max_length: 150,
        min_length: 1,
        hint: 'e.g. Campus Prayer, SURGE Workshop',
        placeholder: '<event_name>',
        name: 'name',
        label: 'Name',
      }, {
        type: 'text',
        max_length: 150,
        min_length: 1,
        hint: 'e.g. 2018-05-01 8:00pm || 2018-05-02 9.30pm',
        placeholder: '<event_start_date> || <event_end_date>',
        name: 'date',
        label: 'Date',
      }, {
        type: 'text',
        max_length: 150,
        min_length: 1,
        hint: 'e.g. Trinity@PL T2',
        placeholder: '<event_location>',
        name: 'location',
        label: 'Location',
      }, {
        type: 'textarea',
        min_length: 1,
        max_length: 3000,
        hint: 'e.g. Come join us... || https://image.com',
        placeholder: '<description> || <image_url>',
        name: 'description',
        label: 'Description',
      }, {
        type: 'select',
        value: 'required',
        options: [{
          label: 'Required',
          value: 'required',
        }, {
          label: 'Not Required',
          value: 'not_required',
        }],
        name: 'attendance_required',
        label: 'Is Attendance Required?',
      }],
    },
  };
  try {
    const response = await sCaller.postToSlackApi('dialog.open', data);
    console.log(response);
  } catch (error) {
    console.log("Error occured when sending add events form:", error);
  }
}

module.exports = {
  sendFeedback,
  sendAddEventForm,
};
