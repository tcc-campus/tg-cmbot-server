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
async function postToSlack(data) {
  const payload = Object.assign({
    username: 'CampusBot',
    icon_emoji: ':robot_face:',
  }, data);
  try {
    const response = await axios({
      url: config.SLACK_WEBHOOK,
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

module.exports = {
  postToSlack,
};
