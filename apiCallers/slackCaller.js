/**
 * APIs for Slack Server
 */

const config = require('../config');
const axios = require('axios');

/**
 * Post request to Slack Server
 * @param {Object} payload
 *
 * @private
 */
async function postToSlack(url, data, token) {
  const payload = Object.assign({
    username: 'CampusBot',
    icon_emoji: ':robot_face:',
  }, data);
  const options = {
    url: url,
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    data: payload,
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await axios(options);
    if (response.status !== 200) {
      throw new Error(JSON.stringify(response.data));
    }
    return JSON.stringify(response.data);
  } catch (error) {
    throw new Error(error);
  }
}

async function postToDevelopersChannel(data) {
  await postToSlack(config.SLACK_WEBHOOK, data)
}

async function postToSlackApi(endpoint, data) {
  const token = config.SLACK_BOT_TOKEN;
  const response = await postToSlack(`https://slack.com/api/${endpoint}`, data, token);
  return response;
}

module.exports = {
  postToDevelopersChannel,
  postToSlackApi
};
